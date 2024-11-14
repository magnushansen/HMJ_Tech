// components/Card.tsx
import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  rank: string;
  suit: string;
}

const Card: React.FC<CardProps> = ({ rank, suit }) => {
  return (
    <div className={styles.card}>
      <div className={styles.topLeft}>
        <span>{rank}</span>
        <span>{suit}</span>
      </div>
      <div className={styles.centerSuit}>{suit}</div>
      <div className={styles.bottomRight}>
        <span>{rank}</span>
        <span>{suit}</span>
      </div>
    </div>
  );
};

export default Card;
