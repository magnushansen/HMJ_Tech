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
    <div className={styles.scoreboardContainer}>
      <h2 className={styles.title}>Game Scoreboard</h2>
      <table className={styles.scoreboardTable}>
        <thead>
          <tr>
            <th>Round</th>
            <th>Team 1</th>
            <th>Team 2</th>
            <th>Change</th>
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
        <div className={styles.teamScoreBox}>
          <p>Team 1</p>
          <p>{scores.team1}</p>
        </div>
        <div className={styles.teamScoreBox}>
          <p>Team 2</p>
          <p>{scores.team2}</p>
        </div>
      </div>
      {winner && <p className={styles.winner}>Winner: {winner}</p>}
    </div>
  );
};

export default GameScoreboard;
