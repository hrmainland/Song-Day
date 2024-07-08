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

export async function fetchUserId() {
  try {
    const response = await fetch(`${baseUrl}/user/id`, {
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
