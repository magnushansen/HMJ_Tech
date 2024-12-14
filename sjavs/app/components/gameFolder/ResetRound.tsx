"use client";

import React, { useEffect } from "react";
import { calculateFinalScore } from "../../../lib/scoring";
import { shuffleDeck, dealCards } from "../../../lib/gameUtils";

interface ResetRoundProps {
  roundScores: number[][];
  gameScores: { team1: number; team2: number };
  trumpSuit: string | null;
  onScoresUpdated: (newScores: { team1: number; team2: number }) => void;
  onScoreHistoryUpdate: (newEntry: {
    round: number;
    team1: number;
    team2: number;
    change: string;
  }) => void;
  onHandsReset: (newHands: string[][]) => void;
  onGameEnd: (winner: string) => void;
}

const ResetRound: React.FC<ResetRoundProps> = ({
  roundScores,
  gameScores,
  trumpSuit,
  onScoresUpdated,
  onScoreHistoryUpdate,
  onHandsReset,
  onGameEnd,
}) => {
  useEffect(() => {
    if (roundScores.length > 0) {
      const resetRound = () => {
        const lastRoundScores = roundScores[roundScores.length - 1] || [0, 0, 0];
        const team1Points = lastRoundScores[0];
        const team2Points = lastRoundScores[1];

        const [team1Decrement, team2Decrement] = calculateFinalScore(
          team1Points,
          team2Points,
          trumpSuit
        );

        const updatedScores = {
          team1: Math.max(0, gameScores.team1 - team1Decrement),
          team2: Math.max(0, gameScores.team2 - team2Decrement),
        };

        if (updatedScores.team1 === 0 || updatedScores.team2 === 0) {
          const winner = updatedScores.team1 === 0 ? "Team 1" : "Team 2";
          onGameEnd(winner);
          return;
        }

        onScoreHistoryUpdate({
          round: roundScores.length,
          team1: updatedScores.team1,
          team2: updatedScores.team2,
          change: `-${team1Decrement} / -${team2Decrement}`,
        });

        onScoresUpdated(updatedScores);

        const newDeck = shuffleDeck();
        const newHands = dealCards(newDeck);
        onHandsReset(newHands);
      };

      resetRound();
    }
  }, [roundScores]);

  return null;
};

export default ResetRound;
