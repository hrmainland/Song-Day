import { refreshToken } from "./apiCalls";

async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  accessToken = null
) {
  try {
    var options = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    var response = await fetch(`${endpoint}`, options);

    if (response.status === 401) {

      const refreshedTokenObject = await refreshToken();
      const newToken = refreshedTokenObject.access_token;
      options = {
        method,
        headers: {
          Authorization: `Bearer ${newToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
  
      if (body) {
        options.body = JSON.stringify(body);
      }
  
      response = await fetch(`${endpoint}`, options);
    }

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

export async function getProfile(accessToken) {
  return await apiRequest(
    "https://api.spotify.com/v1/me",
    "GET",
    null,
    accessToken
  );
}

export async function searchTracks(accessToken, query) {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`;
    return await apiRequest(url, "GET", null, accessToken);
  }

export async function getTrackById(accessToken, trackId) {
  const url = `https://api.spotify.com/v1/tracks/${trackId}`;
  return await apiRequest(url, "GET", null, accessToken);
}

export async function getMultipleTracksById(accessToken, trackIds) {
  const url = `https://api.spotify.com/v1/tracks?ids=${encodeURIComponent(trackIds.join(","))}`;
  const tracksObject = await apiRequest(url, "GET", null, accessToken);
  return tracksObject["tracks"];
}