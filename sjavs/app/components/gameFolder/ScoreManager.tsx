import React from "react";

interface ScoreManagerProps {
  currentGameScores: { team1: number; team2: number }; // Current LHS scoreboard scores
  latestRoundScores: { team1: number; team2: number }; // RHS scores from the last round
  onScoresUpdated: (newScores: { team1: number; team2: number }) => void; // Callback to update the LHS scores in `CardLayout`
  onGameEnd: (winner: string) => void; // Callback when a team wins the game
}

const ScoreManager: React.FC<ScoreManagerProps> = ({
  currentGameScores,
  latestRoundScores,
  onScoresUpdated,
  onGameEnd,
}) => {
  const updateScores = () => {
    const team1Decrement = latestRoundScores.team1;
    const team2Decrement = latestRoundScores.team2;

    // Calculate new scores
    const newScores = {
      team1: Math.max(0, currentGameScores.team1 - team1Decrement),
      team2: Math.max(0, currentGameScores.team2 - team2Decrement),
    };

    // Check if a team has won
    if (newScores.team1 === 0 || newScores.team2 === 0) {
      const winner = newScores.team1 === 0 ? "Team 1" : "Team 2";
      onGameEnd(winner); // Notify `CardLayout` about the winner
    }

    // Update scores in `CardLayout`
    onScoresUpdated(newScores);
  };

  React.useEffect(() => {
    updateScores();
  }, [latestRoundScores]); // Trigger score updates when new round scores are passed in

  return null; // No UI for this component
};

export default ScoreManager;
