"use client";

import React, { useState } from "react";
import styles from "./CardAnimation.module.css";

interface CardProps {
  rank: string;
  suit: string;
}

const Card: React.FC<CardProps> = ({ rank, suit }) => {
  const [isCentered, setIsCentered] = useState(false);

  const imageName = `${rank}_of_${suit}.png`;
  const imageSrc = `/assets/${imageName}`;

  const handleCardClick = () => {
    setIsCentered(!isCentered);
  };

  return (
    <div
      className={`${styles.card} ${isCentered ? styles.centered : ""}`}
      onClick={handleCardClick}
    >
      <img
        src={imageSrc}
        alt={`${rank} of ${suit}`}
        className={styles.cardImage}
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
    </div>
  );
};

export default Card;
