"use client";

import React, { useState } from "react";
import Card from "./Cards";
import TrickManager from "./TrickManager";
import TurnManager from "./TurnManager";
import styles from "./CardLayout.module.css";
import { shuffleDeck, dealCards, chooseTrump } from "../../lib/gameUtils";

const CardLayout: React.FC = () => {
  const [hands, setHands] = useState<string[][]>([]); // Hands for each player
  const [trumpSuit, setTrumpSuit] = useState<string | null>(null); // Chosen trump suit
  const [centeredCard, setCenteredCard] = useState<string | null>(null); // Track the centered card

  // Function to start the game
  const startGame = () => {
    const deck = shuffleDeck();
    const dealtHands = dealCards(deck);
    const trumpInfo = chooseTrump(dealtHands);

    if (trumpInfo) {
      setHands(dealtHands); // Set player hands
      setTrumpSuit(trumpInfo.trumpSuit); // Set the trump suit
    } else {
      alert("Re-dealing as no player has a strong trump suit.");
      startGame(); // Retry if trump is not chosen
    }
  };

  // Function to handle when a trick is completed
  const handleTrickComplete = (trick: { player: number; card: string }[]) => {
    console.log("Trick is complete:", trick);
    // Example: Calculate the winner of the trick or update scores here
  };

  return (
    <TurnManager players={hands.length}>
      {({ currentTurn, nextTurn }) => (
        <TrickManager
          players={hands.length}
          trumpSuit={trumpSuit}
          hands={hands}
          onTrickComplete={handleTrickComplete}
        >
          {({ leadingSuit, currentTrick, validatePlay, playCard }) => (
            <div className={styles.gameContainer}>
              {/* Start Game Button */}
              <button onClick={startGame} className={styles.startButton}>
                Start Game
              </button>
              {trumpSuit && <p className={styles.trumpSuit}>Trump Suit: {trumpSuit}</p>}
              <p className={styles.currentTurn}>Player Turn: {currentTurn + 1}</p>

              {/* Centered card display */}
              {centeredCard && (
                <div className={styles.centeredContainer}>
                  <Card
                    key={centeredCard}
                    rank={centeredCard.split(" ")[0]}
                    suit={centeredCard.split(" ")[1]}
                    isCentered={true}
                    isClickable={false}
                    onClick={() => setCenteredCard(null)}
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
                      onClick={() => {
                        if (playerIndex === currentTurn) {
                          if (validatePlay(card, playerIndex)) {
                            console.log(`Player ${playerIndex + 1} played ${card}`);
                            playCard(card, playerIndex); // Register the play
                            setCenteredCard(card); // Display the played card in the center
                            setHands((prevHands) =>
                              prevHands.map((h, i) =>
                                i === playerIndex ? h.filter((c) => c !== card) : h
                              )
                            );
                            nextTurn(); // Move to the next player's turn
                          } else {
                            alert(
                              `Invalid play! You must follow the ${leadingSuit} suit or play a ${trumpSuit} card if possible.`
                            );
                          }
                        }
                      }}
                      isClickable={
                        playerIndex === currentTurn &&
                        validatePlay(card, playerIndex)
                      }
                      isCentered={false}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </TrickManager>
      )}
    </TurnManager>
  );
};

export default CardLayout;
