import { createContext, useState } from "react";
import { fetchGame } from "../../utils/apiCalls";

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(!game);
  const [gameError, setGameError] = useState(null);

  const refreshGame = async (gameCode) => {
    try {
      if (!game){
        setLoading(true);
      }
      const gameData = await fetchGame(gameCode);
      if (!gameData) {
        throw new Error("Game not found");
      }
      setGame(gameData);
    } catch (err) {
      console.error("Error fetching game data:", err);
      setGameError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    game,
    refreshGame,
    loading,
    gameError,
  };
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}