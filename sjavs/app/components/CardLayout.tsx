"use client";

import React, { useState } from "react";
import Card from "./Cards";
import styles from "./CardLayout.module.css";

// Import game utilities
import {
  shuffleDeck,
  dealCards,
  chooseTrump,
} from "../../lib/gameUtils";

const CardLayout: React.FC = () => {
  const [hands, setHands] = useState<string[][]>([]); // Hands for each player
  const [trumpSuit, setTrumpSuit] = useState<string | null>(null); // Chosen trump suit

  const startGame = () => {
    const deck = shuffleDeck(); // Generate deck
    const dealtHands = dealCards(deck); // Deal cards
    const trumpInfo = chooseTrump(dealtHands); // Choose trump suit

    if (trumpInfo) {
      setHands(dealtHands);
      setTrumpSuit(trumpInfo.trumpSuit);
    } else {
      alert("Re-dealing as no player has a strong trump suit.");
      startGame(); // Retry if trump is not chosen
    }
  };

  return (
    <div className={styles.gameContainer}>
      <button onClick={startGame} className={styles.startButton}>
        Start Game
      </button>
      {trumpSuit && <p className={styles.trumpSuit}>Trump Suit: {trumpSuit}</p>}

      {/* Player hands */}
      {hands.map((hand, playerIndex) => (
        <div
          key={playerIndex}
          className={`${styles.hand} ${styles[`player${playerIndex + 1}`]}`}
        >
          {hand.map((card) => (
            <Card
              key={card}
              rank={card.split(" ")[0]}
              suit={card.split(" ")[1]} 
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default CardLayout;
