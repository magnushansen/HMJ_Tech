import React, { useState } from "react";

interface TurnManagerProps {
  players: number; // Number of players
  children: (props: {
    currentTurn: number; // Current player's turn
    nextTurn: () => void; // Function to move to the next turn
  }) => React.ReactNode;
}

const TurnManager: React.FC<TurnManagerProps> = ({ players, children }) => {
  const [currentTurn, setCurrentTurn] = useState(0);

  const nextTurn = () => {
    setCurrentTurn((prevTurn) => (prevTurn + 1) % players); // Cycle through players
  };

  return <>{children({ currentTurn, nextTurn })}</>;
};

export default TurnManager;
