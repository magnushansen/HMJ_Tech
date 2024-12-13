import React from "react";
import styles from "./GameScoreboard.module.css";

interface GameScoreboardProps {
  trumpSuit: string;
  history: { round: number; team1: number; team2: number; change: string }[];
  scores: { team1: number; team2: number };
  winner: string | null;
}

const GameScoreboard: React.FC<GameScoreboardProps> = ({
  trumpSuit,
  history,
  scores,
  winner,
}) => {
  return (
    <div className={styles.gameScoreboard}>
      <h2>Game Scoreboard</h2>
      <table className={styles.scoreboardTable}>
        <thead>
          <tr>
            <th>Round</th>
            <th>Team 1 Points</th>
            <th>Team 2 Points</th>
            <th>Change in Score</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry) => (
            <tr key={entry.round}>
              <td>{entry.round}</td>
              <td>{entry.team1}</td>
              <td>{entry.team2}</td>
              <td>{entry.change}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.currentScores}>
        <p>Team 1 Remaining Points: {scores.team1}</p>
        <p>Team 2 Remaining Points: {scores.team2}</p>
      </div>
      {winner && <p className={styles.winner}>Winner: {winner}</p>}
    </div>
  );
};

export default GameScoreboard;
