import { createContext, useState } from "react";
import { fetchGame } from "../../utils/apiCalls";

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshGame = async (gameCode) => {
    try {
      if (!game){
        setLoading(true);
      }
      const gameData = await fetchGame(gameCode);
      setGame(gameData);
    } catch (err) {
      console.error("Error fetching game data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    game,
    refreshGame,
    loading,
    error,
  };
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}