import React, { useState, useEffect } from "react";

interface TurnManagerProps {
  players: number; // Number of players
  startingPlayer: number; // Player who starts the new trick
  children: (props: {
    currentTurn: number; // Current player's turn
    nextTurn: () => void; // Function to move to the next turn
    setStartingPlayer: (player: number) => void; // Function to set the starting player for the next trick
  }) => React.ReactNode;
}

const TurnManager: React.FC<TurnManagerProps> = ({ players, startingPlayer, children }) => {
  const [currentTurn, setCurrentTurn] = useState(startingPlayer);

  useEffect(() => {
    setCurrentTurn(startingPlayer);
  }, [startingPlayer]);

  const nextTurn = () => {
    setCurrentTurn((prevTurn) => (prevTurn + 1) % players); // Cycle through players
  };

  const setStartingPlayer = (player: number) => {
    setCurrentTurn(player);
  };

  return <>{children({ currentTurn, nextTurn, setStartingPlayer })}</>;
};

export default TurnManager;