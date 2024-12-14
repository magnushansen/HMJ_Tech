"use client";

import { determineTrickWinner, calculateTrickPoints } from "../../../lib/gameUtils";

interface HandleTrickCompleteProps {
  trick: { player: number; card: string }[];
  trumpSuit: string | null;
  hands: string[][];
  roundScores: number[][];
  setRoundScores: React.Dispatch<React.SetStateAction<number[][]>>;
  setStartingPlayer: (player: number) => void;
  onRoundEnd: () => void;
  setTricksPlayed: React.Dispatch<React.SetStateAction<number>>;
  tricksPlayed: number;
}
const handleTrickComplete = ({
    trick,
    trumpSuit,
    hands,
    roundScores,
    setRoundScores,
    setStartingPlayer,
    onRoundEnd,
    setTricksPlayed,
    tricksPlayed,
  }: HandleTrickCompleteProps) => {
    if (trick.length !== 4) {
      console.error("Incomplete trick: Not all players have played.");
      return;
    }
  
    console.log("Trick is complete:", trick);
  
    const trickWinner = determineTrickWinner(trick, trumpSuit);
    const trickPoints = calculateTrickPoints(trick);
  
    console.log(`Player ${trickWinner + 1} wins the trick. Points: ${trickPoints}`);
  
    const winningTeam = trickWinner % 2 === 0 ? 0 : 1;
  
    setRoundScores((prevScores) => {
      const newScores = [...prevScores];
  
      if (newScores.length === 0) {
        const initialScores = [0, 0, 0]; // [Team 1 Total, Team 2 Total, Points Gained]
        initialScores[winningTeam] += trickPoints;
        initialScores[2] = trickPoints;
        newScores.push(initialScores);
      } else {
        const lastRound = newScores[newScores.length - 1];
        const updatedTotals = [...lastRound];
        updatedTotals[winningTeam] += trickPoints;
        newScores.push([...updatedTotals.slice(0, 2), trickPoints]);
      }
  
      return newScores;
    });
  
    // Increment tricks played
    setTricksPlayed((prev) => prev + 1);
  
    if (tricksPlayed + 1 === 8) {
      // All 8 tricks are done for this round
      console.log("All tricks are complete. Resetting round.");
      onRoundEnd(); // Trigger round reset logic
      setTricksPlayed(0); // Reset the trick counter for the next round
    }
  
    setStartingPlayer(trickWinner); // Set the next starting player
  };
  

  export default handleTrickComplete;