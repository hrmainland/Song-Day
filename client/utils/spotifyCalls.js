async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  accessToken = null
) {
  try {
    const options = {
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

    const response = await fetch(`${endpoint}`, options);

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
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=30`;
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


export async function getRefreshToken(user) {
  // refresh token that has been previously stored
  const refreshToken = user.refresh_token;
  const clientId = "3db1ac7a10994db384064b7ae0b88369"
  const url = "https://accounts.spotify.com/api/token";

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId
    }),
  }
  const body = await fetch(url, payload);
  const response = await body.json();

  return response;
}
