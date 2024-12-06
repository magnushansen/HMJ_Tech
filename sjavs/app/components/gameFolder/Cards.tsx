"use client";

import React from "react";
import styles from "./CardAnimation.module.css";

interface CardProps {
  rank: string; // The rank of the card (e.g., "Ace", "King", etc.)
  suit: string; // The suit of the card (e.g., "Spades", "Hearts", etc.)
  isCentered: boolean; // Whether the card is currently in the centered state
  isClickable: boolean; // Whether the card is clickable (for turns and disabled cards)
  onClick: () => void; // The function to call when the card is clicked
}

const Card: React.FC<CardProps> = ({ rank, suit, isCentered, isClickable, onClick }) => {
  const imageName = `${rank}_of_${suit}.png`;
  const imageSrc = `/assets/${imageName}`;

  // Log the card's props when it is rendered
  console.log(`Rendering card: ${rank} of ${suit}, Centered: ${isCentered}, Clickable: ${isClickable}`);

  return (
    <div
      className={`${styles.card} ${isCentered ? styles.centered : ""} ${
        isClickable ? "" : styles.disabled
      }`}
      onClick={isClickable ? () => {
        console.log(`Card clicked: ${rank} of ${suit}`);
        onClick();
      } : undefined} // Only allow clicks if the card is clickable
    >
      <img
        src={imageSrc}
        alt={`${rank} of ${suit}`}
        className={styles.cardImage}
        loading="lazy"
        onError={(e) => {
          console.log("Image not found:", imageSrc);
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
};

export default Card;