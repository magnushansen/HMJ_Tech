"use client";

import React, { useState } from "react";
import Card from "./Cards";
import styles from "./CardLayout.module.css";
import { shuffleDeck, dealCards, chooseTrump } from "../../lib/gameUtils";

const CardLayout: React.FC = () => {
  const [hands, setHands] = useState<string[][]>([]); // Hands for each player
  const [trumpSuit, setTrumpSuit] = useState<string | null>(null); // Chosen trump suit
  const [centeredCard, setCenteredCard] = useState<string | null>(null); // Track the centered card

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

  const handleCardClick = (card: string, playerIndex: number) => {
    // Remove the clicked card from the player's hand
    const updatedHands = hands.map((hand, index) =>
      index === playerIndex ? hand.filter((c) => c !== card) : hand
    );
    setHands(updatedHands);

    // Set the clicked card as the centered card
    setCenteredCard(card);
  };

  const handleRemoveCenteredCard = () => {
    setCenteredCard(null); // Remove the centered card
  };

  return (
    <div className={styles.gameContainer}>
      <button onClick={startGame} className={styles.startButton}>
        Start Game
      </button>
      {trumpSuit && <p className={styles.trumpSuit}>Trump Suit: {trumpSuit}</p>}

      {/* Global container for centered card */}
      {centeredCard && (
        <div className={styles.centeredContainer} onClick={handleRemoveCenteredCard}>
          <Card
            key={centeredCard}
            rank={centeredCard.split(" ")[0]}
            suit={centeredCard.split(" ")[1]}
            isCentered={true}
            onClick={handleRemoveCenteredCard} // Remove centered card on click
          />
        </div>
      )}

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
              isCentered={false}
              onClick={() => handleCardClick(card, playerIndex)} // Pass player index and card
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default CardLayout;
