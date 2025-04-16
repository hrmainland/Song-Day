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

    if (response.status === 401) {
      // Redirect to home-login on 401 Unauthorized errors
      window.location.href = "/home-login";
      return false;
    }

    return response;
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
  const response = await apiRequest("/user/me");
  return await response.json();
}

export async function fetchMyId() {
  const response = await apiRequest("/user/my-id");
  return await response.json();
}

export async function addGameToMe(gameId) {
  const response = await apiRequest(`/user/game/${gameId}`, "PUT");
  return await response.json();
}

export async function isLoggedIn() {
  const response = await apiRequest("/user/isLoggedIn");
  return await response.json();
}

export async function fetchMyGames() {
  const response = await apiRequest("/user/my-games");
  return await response.json();
}

export async function refreshToken() {
  const response = await apiRequest("/user/refresh-token");
  return await response.json();
}

export async function fetchAccessToken() {
  const response = await apiRequest("/user/access-token");
  return await response.json();
}

export async function logout() {
  await apiRequest("/user/logout", "POST");
  window.location.href = "/home";
}

// Game endpoints

export async function fetchGame(gameCode, authRequired = true) {
  const response = await apiRequest(`/game/${gameCode}?authRequired=${authRequired}`);
  if ([403, 404].includes(response.status)) {
    return false;
  }
  return await response.json();
}

export async function newGame(gameName, settings) {
  const response = await apiRequest("/game/new", "POST", { gameName, settings });
  return await response.json();
}

export async function addMeToGame(gameId) {
  const response = await apiRequest(`/game/${gameId}/add-me`, "PUT");
  return await response.json();
}

export async function removePlayerFromGame(gameId, userId) {
  const response = await apiRequest(`/game/${gameId}/remove-player/${userId}`, "DELETE");
  return await response.json();
}

export async function addTrackGroupToGame(gameId, trackGroupId) {
  const response = await apiRequest(`/game/${gameId}/track-group/${trackGroupId}`, "PUT");
  return await response.json();
}

export async function addVoteGroupToGame(gameId, voteGroupId) {
  const response = await apiRequest(`/game/${gameId}/vote-group/${voteGroupId}`, "PUT");
  return await response.json();
}

// export async function getAllGameTracks(gameId) {
//   return await apiRequest(`/game/${gameId}/all-tracks`);
// }

export async function updateDisplayName(gameId, displayName) {
  const response = await apiRequest(`/game/${gameId}/display-name`, "PUT", {
    displayName,
  })
  return await response.json();
}

export async function newVoteGroup(gameId, items) {
  const response = await apiRequest(`/game/${gameId}/vote-group`, "POST", { items });
  return await response.json();
}

export async function moveToVoting(gameId) {
  const response = await apiRequest(`/game/${gameId}/move-to-voting`, "POST");
  return await response.json();
}

export async function createPlaylist(gameId) {
  const response = await apiRequest(`/game/${gameId}/create-playlist`);
  return await response.json();
}

// Trackgroup endpoints

export async function addSessionTracks(sessionTracks) {
  const response = await apiRequest("/track-group", "POST", { sessionTracks });
  return await response.json();
}

