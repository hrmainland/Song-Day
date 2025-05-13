import baseUrl from "./urlPrefix.js";
import { addCsrfHeader, invalidateCsrfToken } from './csrfUtils';

class ApiError extends Error {
  constructor(message, status, endpoint, retryAfter = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.endpoint = endpoint;
    this.retryAfter = retryAfter;
  }
}

// Helper to handle common response status checks
const handleResponseStatus = async (response, endpoint) => {
  // Handle specific status codes
  if (response.status === 401) {
    // Redirect to home-login on 401 Unauthorized errors
    window.location.href = "/home-login";
    throw new ApiError("Unauthorized access. Please log in again.", 401, endpoint);
  }
  
  if (response.status === 429) {
    // Handle rate limiting according to Spotify API terms
    const retryAfter = response.headers.get("Retry-After") || 60; // Default to 60 seconds if header not present
    throw new ApiError(
      `Rate limit exceeded. Please try again later.`, 
      429, 
      endpoint, 
      parseInt(retryAfter, 10)
    );
  }
  
  if (response.status >= 400) {
    // Get error message from response if possible
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || `Request failed with status ${response.status}`;
    } catch (e) {
      errorMessage = `Request failed with status ${response.status}`;
    }
    throw new ApiError(errorMessage, response.status, endpoint);
  }
  
  return response;
};

// Core API request function
async function apiRequest(endpoint, method = "GET", body = null, retryCount = 0) {
  const maxRetries = 3;

  try {
    const options = {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: 'include', // Important to include cookies for CSRF
    };

    // Add CSRF token header for state-changing methods
    if (method !== "GET" && method !== "HEAD") {
      options.headers = await addCsrfHeader(options.headers);
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, options);

    // Check if we need to refresh CSRF token (based on 403 with specific error)
    if (response.status === 403) {
      try {
        const errorData = await response.clone().json();
        if (errorData.code === "CSRF_ERROR") {
          // Invalidate token and retry once
          invalidateCsrfToken();
          if (retryCount === 0) {
            console.warn("CSRF token expired, retrying with new token");
            return apiRequest(endpoint, method, body, 1);
          }
        }
      } catch (e) {
        // If we can't parse JSON, continue with normal error handling
      }
    }

    return await handleResponseStatus(response, endpoint);
  } catch (error) {
    // Handle network errors and retry logic
    if (error.name === "ApiError") {
      // For rate limit errors, we can implement retry with delay
      if (error.status === 429 && retryCount < maxRetries) {
        console.warn(`Rate limited on ${endpoint}. Retrying after ${error.retryAfter} seconds...`);
        await new Promise(resolve => setTimeout(resolve, error.retryAfter * 1000));
        return apiRequest(endpoint, method, body, retryCount + 1);
      }
      // Re-throw API errors for caller handling
      throw error;
    }
    
    // Network or other fetch errors
    if (retryCount < maxRetries && !navigator.onLine) {
      // Wait and retry if it's a network issue
      console.warn(`Network error on ${endpoint}. Retrying...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return apiRequest(endpoint, method, body, retryCount + 1);
    }
    
    console.error(`Request failed for ${endpoint}:`, error);
    throw new ApiError(
      "Network error. Please check your connection and try again.",
      0,
      endpoint
    );
  }
}

// Helper to safely unwrap API responses
async function unwrapResponse(promise) {
  try {
    const response = await promise;
    if (!response) return { success: false, data: null };
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { 
        success: false, 
        error: {
          message: error.message,
          status: error.status,
          endpoint: error.endpoint
        }
      };
    }
    return { 
      success: false, 
      error: {
        message: error.message || "Unknown error occurred",
        status: 0,
        endpoint: "unknown"
      }
    };
  }
}

// User endpoints

export async function fetchMe() {
  const result = await unwrapResponse(apiRequest("/user/me"));
  return result.data;
}

export async function fetchMyId() {
  const result = await unwrapResponse(apiRequest("/user/my-id"));
  return result.data;
}

export async function addGameToMe(gameId) {
  const result = await unwrapResponse(apiRequest(`/user/game/${gameId}`, "PUT"));
  return result.data;
}

export async function isLoggedIn() {
  const result = await unwrapResponse(apiRequest("/user/isLoggedIn"));
  return result.data;
}

export async function fetchMyGames() {
  const result = await unwrapResponse(apiRequest("/user/my-games"));
  return result.data;
}


export async function logout() {
  await apiRequest("/user/logout", "POST");
  window.location.href = "/home";
}

export async function deleteMe() {
  const result = await unwrapResponse(apiRequest("/user/delete-me", "DELETE"));
  return result;
}

// Terms acceptance endpoints
export async function checkTermsStatus() {
  const result = await unwrapResponse(apiRequest("/user/terms-status"));
  return result.data;
}

export async function acceptTerms() {
  const result = await unwrapResponse(apiRequest("/user/accept-terms", "POST"));
  return result.data;
}

// Game endpoints

export async function fetchGame(gameCode) {
  const result = await unwrapResponse(apiRequest(`/game/${gameCode}`));
  return result.data;
}

// used for checking game info before adding user to game
export async function fetchGameInfo(gameCode) {
  const result = await unwrapResponse(apiRequest(`/game/info/${gameCode}`));
  return result.data;
}

export async function newGame(gameName, settings) {
  const result = await unwrapResponse(apiRequest("/game/new", "POST", { gameName, settings }));
  return result.data;
}

export async function addMeToGame(gameId) {
  const result = await unwrapResponse(apiRequest(`/game/${gameId}/add-me`, "PUT"));
  return result.data;
}

export async function removePlayerFromGame(gameId, userId) {
  const result = await unwrapResponse(apiRequest(`/game/${gameId}/remove-player/${userId}`, "DELETE"));
  return result.data;
}

export async function addTrackGroupToGame(gameId, trackGroupId) {
  const result = await unwrapResponse(apiRequest(`/game/${gameId}/track-group/${trackGroupId}`, "PUT"));
  return result.data;
}

export async function addVoteGroupToGame(gameId, voteGroupId) {
  const result = await unwrapResponse(apiRequest(`/game/${gameId}/vote-group/${voteGroupId}`, "PUT"));
  return result.data;
}

export async function updateDisplayName(gameId, displayName) {
  const result = await unwrapResponse(apiRequest(`/game/${gameId}/display-name`, "PUT", {
    displayName,
  }));
  return result.data;
}

export async function newVoteGroup(gameId, items) {
  const result = await unwrapResponse(apiRequest(`/game/${gameId}/vote-group`, "POST", { items }));
  return result.data;
}

export async function moveToVoting(gameId) {
  const result = await unwrapResponse(apiRequest(`/game/${gameId}/move-to-voting`, "POST"));
  return result.data;
}

export async function createPlaylist(gameId) {
  const result = await unwrapResponse(apiRequest(`/game/${gameId}/create-playlist`));
  return result.data;
}

// Trackgroup endpoints

export async function addSessionTracks(sessionTracks) {
  const result = await unwrapResponse(apiRequest("/track-group", "POST", { sessionTracks }));
  return result.data;
}