// TurnManager.tsx

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

  // Move to the next player in a clockwise direction
  const nextTurn = () => {
    setCurrentTurn((prevTurn) => (prevTurn + players - 1) % players); // Cycle through players in reverse order
  };

  // Set the starting player for the next round
  const setStartingPlayer = (player: number) => {
    setCurrentTurn(player);
  };

  return <>{children({ currentTurn, nextTurn, setStartingPlayer })}</>;
};

export default TurnManager;
