import { useContext } from "react";
import { GameContext } from "../context/gameContext";

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}