import baseUrl from "./urlPrefix";

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

// User endoints

export async function fetchMe() {
  return await apiRequest("/user/me");
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

// Game endpoints

export async function fetchGame(gameCode) {
  return await apiRequest(`/game/${gameCode}`);
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

export async function getAllGameTracks(gameId) {
  return await apiRequest(`/game/${gameId}/all-tracks`);
}

export async function getAllVotableTracks(gameId) {
  return await apiRequest(`/game/${gameId}/votable-tracks`);
}

export async function getMyTrackGroup(gameId) {
  return await apiRequest(`/game/${gameId}/my-track-group`);
}

export async function getMyVoteGroup(gameId) {
  return await apiRequest(`/game/${gameId}/my-vote-group`);
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
