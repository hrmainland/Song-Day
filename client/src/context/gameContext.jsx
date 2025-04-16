import { useContext, createContext, useState, useEffect } from "react";
import { fetchGame } from "../../utils/apiCalls";
import { UserContext } from "./userProvider";

export const GameContext = createContext();

export function GameProvider({ children }) {
  const { userId } = useContext(UserContext);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(!game);
  const [gameError, setGameError] = useState(null);
  const [isHost, setIsHost] = useState(false);

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

  useEffect(() => {
    if (userId && game){
      setIsHost(game.host === userId);
    }
  }, [userId, game]);
  
  const value = {
    isHost,
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