/*ScoreTable.tsx */

import React from "react";
import styles from "./ScoreTable.module.css";

interface ScoreTableProps {
  roundScores: number[][]; // Accepts an array of arrays for team scores
}

const ScoreTable: React.FC<ScoreTableProps> = ({ roundScores }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Round</th>
          <th>Team 1</th>
          <th>Team 2</th>
        </tr>
      </thead>
      <tbody>
        {roundScores.map((score, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{score[0]}</td>
            <td>{score[1]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ScoreTable;
