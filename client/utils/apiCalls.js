import baseUrl from "./urlPrefix.js";

async function apiRequest(endpoint, method = "GET", body = null) {
  try {
    const options = {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, options);

    if (response.status === 404) {
      return false;
    }

    if (!response.ok) {
      throw new Error(`HTTP error - status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`There was a problem with the request to ${endpoint}`, error);
    throw error;
  }
}

// login endpoints

// TODO add login function here that accepts redirect route and sends login request
// if successful redirect otherwise return to home-login

// User endoints

export async function fetchMe() {
  return await apiRequest("/user/me");
}

export async function fetchMyId() {
  return await apiRequest("/user/my-id");
}

export async function addGameToMe(gameId) {
  return await apiRequest(`/user/game/${gameId}`, "PUT");
}

export async function isLoggedIn() {
  return await apiRequest("/user/isLoggedIn");
}

export async function fetchMyGames() {
  return await apiRequest("/user/my-games");
}

export async function refreshToken() {
  return await apiRequest("/user/refresh-token");
}

export async function fetchAccessToken() {
  return await apiRequest("/user/access-token");
}

export async function logout() {
  return await apiRequest("/user/logout", "POST");
}

// Game endpoints

export async function fetchGame(gameCode, authRequired = true) {
  return await apiRequest(`/game/${gameCode}?authRequired=${authRequired}`);
}

export async function newGame(gameName, settings) {
  return await apiRequest("/game/new", "POST", { gameName, settings });
}

export async function addMeToGame(gameId) {
  return await apiRequest(`/game/${gameId}/add-me`, "PUT");
}

export async function removePlayerFromGame(gameId, userId) {
  return await apiRequest(`/game/${gameId}/remove-player/${userId}`, "DELETE");
}

export async function addTrackGroupToGame(gameId, trackGroupId) {
  return await apiRequest(`/game/${gameId}/track-group/${trackGroupId}`, "PUT");
}

export async function addVoteGroupToGame(gameId, voteGroupId) {
  return await apiRequest(`/game/${gameId}/vote-group/${voteGroupId}`, "PUT");
}

// export async function getAllGameTracks(gameId) {
//   return await apiRequest(`/game/${gameId}/all-tracks`);
// }

export async function updateDisplayName(gameId, displayName) {
  return await apiRequest(`/game/${gameId}/display-name`, "PUT", {
    displayName,
  })
}

export async function newVoteGroup(gameId, items) {
  return await apiRequest(`/game/${gameId}/vote-group`, "POST", { items });
}

export async function createPlaylist(gameId) {
  return await apiRequest(`/game/${gameId}/create-playlist`);
}

// Trackgroup endpoints

export async function addSessionTracks(sessionTracks) {
  return await apiRequest("/track-group", "POST", { sessionTracks });
}
