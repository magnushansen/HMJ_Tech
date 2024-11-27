"use client";

import React from "react";
import styles from "./CardAnimation.module.css";

interface CardProps {
  rank: string;
  suit: string;
  isCentered: boolean;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ rank, suit, isCentered, onClick }) => {
  const imageName = `${rank}_of_${suit}.png`;
  const imageSrc = `/assets/${imageName}`;

  return (
    <div
      className={`${styles.card} ${isCentered ? styles.centered : ""}`}
      onClick={onClick}
    >
      <img
        src={imageSrc}
        alt={`${rank} of ${suit}`}
        className={styles.cardImage}
        onError={(e) => {
          console.log("Image not found:", imageSrc); // Debug
          e.currentTarget.style.display = "none"; // Hides card if image fails to load
        }}
      />
    </div>
  );
};

export default Card;
