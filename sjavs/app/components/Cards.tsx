"use client"; // This directive makes this a client component

import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  rank: string;
  suit: string;
}

const Card: React.FC<CardProps> = ({ rank, suit }) => {
  const imageName = `${rank}_of_${suit}.png`;
  const imageSrc = `/assets/${imageName}`; // Use direct path to public assets

  return (
    <div className={styles.card}>
      <img
        src={imageSrc}
        alt={`${rank} of ${suit}`}
        className={styles.cardImage}
        onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image not found
      />
    </div>
  );
};

export default Card;
