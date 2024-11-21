"use client";

import React from "react";
import styles from "./CardAnimation.module.css";

interface CardProps {
  rank: string;
  suit: string;
}

const Card: React.FC<CardProps> = ({ rank, suit }) => {
  const imageName = `${rank}_of_${suit}.png`;
  const imageSrc = `/assets/${imageName}`;

  return (
    <div className={styles.card}>
<img
    src={imageSrc}
    alt={`${rank} of ${suit}`}
    className={styles.cardImage}
    onError={(e) => {
        console.log("Image not found:", imageSrc); // Add this to debug
        e.currentTarget.style.display = "none"; // Hides card if image fails to load
    }}
/>
    </div>
  );
};

export default Card;
