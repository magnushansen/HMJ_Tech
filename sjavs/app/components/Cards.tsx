// components/Card.tsx
import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  rank: string;
  suit: string;
}

const Card: React.FC<CardProps> = ({ rank, suit }) => {
  const imageName = `${rank}_of_${suit}.png`;

  // Dynamically import the image
  let imageSrc;
  try {
    imageSrc = require(`assets/${imageName}`);
  } catch (error) {
    console.error(`Image not found: ${imageName}`, error);
    return <div className={styles.card}>Card image not found</div>;
  }

  return (
    <div className={styles.card}>
      <img src={imageSrc} alt={`${rank} of ${suit}`} className={styles.cardImage} />
    </div>
  );
};

export default Card;
