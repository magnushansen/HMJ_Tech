// components/TrickHandler.tsx

import React from "react";
import { calculateTrickPoints } from "../../lib/gameUtils";

interface TrickHandlerProps {
  trick: { player: number; card: string }[];
  trumpSuit: string | null;
  setScores: React.Dispatch<React.SetStateAction<number[]>>;
  resetTrick: () => void; // Function to reset the trick (setLeadingSuit and setCurrentTrick)
}

const TrickHandler: React.FC<TrickHandlerProps> = ({
  trick,
  trumpSuit,
  setScores,
  resetTrick,
}) => {
  React.useEffect(() => {
    if (trick.length === 4) { // Ensure the trick is complete
      const trickPoints = calculateTrickPoints(trick); // Calculate points


      setScores((prevScores) => {
        const updatedScores = [...prevScores];
        console.log(`Points for this trick: ${trickPoints}`);
        console.log(`Updated Scores - Team 1: ${updatedScores[0]}, Team 2: ${updatedScores[1]}`);
        return updatedScores;
      });

      // Reset the trick after processing
      resetTrick();
    }
  }, [trick, trumpSuit, setScores, resetTrick]);

  return null; // This component is purely for logic; no UI is rendered
};

export default TrickHandler;
