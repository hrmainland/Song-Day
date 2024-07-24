// TODO split these up

import baseUrl from "./urlPrefix";

export async function fetchGame(gameCode) {
  try {
    const response = await fetch(`${baseUrl}/game/${gameCode}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      return false;
    }

    if (!response.ok) {
      throw new Error("Could not fetch game");
    }

    const data = await response.json();

    if (!data) {
      return false;
    }

    return data;
  } catch (error) {
    console.error("There was a problem finding the given game", error);
    throw error; // Re-throw the error to handle it where the function is called
  }
}

export async function newGame(gameName, numSongs) {
  try {
    const response = await fetch(`${baseUrl}/game/new`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameName,
        numSongs,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error - status: ${response.status}`);
    }

    const game = await response.json();
    return game;
  } catch (error) {
    console.error("There was a problem creating the new game", error);
    throw error;
  }
}

export async function fetchMe() {
  try {
    const response = await fetch(`${baseUrl}/user/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      return false;
    }

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("There was a problem finding the given user", error);
    throw error; // Re-throw the error to handle it where the function is called
  }
}

// TODO add better error handling here (for no user, no game, & other cases)

export async function addGameToMe(gameId) {
  try {
    const response = await fetch(`${baseUrl}/user/game/${gameId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      return false;
    }
    if (response.ok) {
      const user = await response.json();
      return user;
    }
  } catch (error) {
    console.error(
      "There was a problem adding the game to the current user",
      error
    );
    throw error;
  }
}

export async function addMeToGame(gameId) {
  try {
    const response = await fetch(`${baseUrl}/game/${gameId}/add-me`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error - status: ${response.status}`);
    }

    const game = await response.json();
    return game;
  } catch (error) {
    console.error(
      "There was a problem adding the current user to the game",
      error
    );
    throw error;
  }
}

export async function addTrackGroupToGame(gameId, trackGroupId) {
  try {
    const response = await fetch(`${baseUrl}/game/${gameId}/${trackGroupId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error - status: ${response.status}`);
    }

    const game = await response.json();
    return game;
  } catch (error) {
    console.error(
      "There was a problem adding the track group user to the game",
      error
    );
    throw error;
  }
}

export async function isLoggedIn() {
  try {
    const response = await fetch(`${baseUrl}/user/isLoggedIn`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return false;
    }
    return true;
  } catch {
    console.error(
      "There was a problem checking the login status of the current user",
      error
    );
    throw error;
  }
}

export async function getProfile(accessToken) {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

  const data = await response.json();
  return data;
}

export async function searchTracks(accessToken, query) {
  const type = "track";

  try {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=${encodeURIComponent(type)}&limit=5`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error - status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`There was a problem with the search: ${query}`, error);
    throw error;
  }
}

export async function addSessionTracks(sessionTracks) {
  try {
    const response = await fetch(`${baseUrl}/track-group`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: sessionTracks,
    });

    if (!response.ok) {
      throw new Error(`HTTP error - status: ${response.status}`);
    }

    const trackGroup = await response.json();
    return trackGroup;
  } catch (error) {
    console.error("There was a problem adding the track group", error);
    throw error;
  }
}

export async function getAllGameTracks(gameId) {
  try {
    const response = await fetch(`${baseUrl}/game/${gameId}/all-tracks`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error - status: ${response.status}`);
    }

    const tracks = await response.json();
    return tracks;
  } catch (error) {
    console.error("There was a problem getting all game tracks", error);
    throw error;
  }
}

export async function getAllVotableTracks(gameId) {
  try {
    const response = await fetch(`${baseUrl}/game/${gameId}/votable-tracks`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error - status: ${response.status}`);
    }

    const tracks = await response.json();
    return tracks;
  } catch (error) {
    console.error("There was a problem getting votable tracks", error);
    throw error;
  }
}

export async function isMyTrackGroupSubmitted(gameId) {
  try {
    const response = await fetch(`${baseUrl}/game/${gameId}/my-submitted`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error - status: ${response.status}`);
    }
    const jsonResponse = await response.json();
    const isSubmitted = jsonResponse.isSubmitted;
    return isSubmitted;
  } catch (error) {
    console.error("There was a problem checking the user's track group", error);
    throw error;
  }
}
