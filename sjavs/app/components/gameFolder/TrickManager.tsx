"use client";

import React, { useState } from "react";
import { getCardSuit, playerHasSuit } from "../../../lib/gameUtils";

interface TrickManagerProps {
  players: number; // Number of players
  trumpSuit: string | null; // Current trump suit
  hands: string[][]; // Current hands of all players
  setHands: React.Dispatch<React.SetStateAction<string[][]>>; // Function to update hands
  setCenteredCard: React.Dispatch<React.SetStateAction<string | null>>; // Function to set centered card
  onTrickComplete: (trick: { player: number; card: string }[]) => void; // Callback when trick is complete
  children: (props: {
    currentTrick: { player: number; card: string }[];
    validatePlay: (card: string, playerIndex: number) => boolean;
    playCard: (card: string, playerIndex: number) => void;
  }) => React.ReactNode;
}

const TrickManager: React.FC<TrickManagerProps> = ({
  players,
  trumpSuit,
  hands,
  setHands,
  setCenteredCard,
  onTrickComplete,
  children,
}) => {
  const [currentTrick, setCurrentTrick] = useState<{ player: number; card: string }[]>([]); // Cards currently played in the ongoing trick

  /**
   * Validates whether the player can legally play the selected card.
   * @param card - The card the player is attempting to play
   * @param playerIndex - The index of the player attempting to play the card
   * @returns {boolean} - Whether the card can be played
   */
  const validatePlay = (card: string, playerIndex: number): boolean => {
    const cardSuit = getCardSuit(card);

    // Check if the player has trump cards
    const hasTrumpSuit = trumpSuit ? playerHasSuit(hands[playerIndex], trumpSuit) : false;
    if (hasTrumpSuit) {
      return cardSuit === trumpSuit; // Must play trump suit if available
    }

    // If no trump cards, any card is valid
    return true;
  };

  const playCard = (card: string, playerIndex: number) => {
    // Prevent playing a card if the player has already played this turn
    if (currentTrick.find((t) => t.player === playerIndex)) {
      console.error(`Player ${playerIndex + 1} has already played in this trick.`);
      return;
    }

    // Add the card to the current trick
    const updatedTrick = [...currentTrick, { player: playerIndex, card }];
    setCurrentTrick(updatedTrick);

    // Remove the card from the player's hand
    setHands((prevHands) =>
      prevHands.map((hand, index) =>
        index === playerIndex ? hand.filter((c) => c !== card) : hand
      )
    );

    // Display the played card in the center
    setCenteredCard(card);

    console.log(`Player ${playerIndex + 1} played ${card}`);
    console.log("Updated Trick:", updatedTrick);

    // If all players have played, process the trick
    if (updatedTrick.length === players) {
      console.log("Trick is complete:", updatedTrick);
      onTrickComplete(updatedTrick);

      // Reset the trick after processing
      setTimeout(() => {
        console.log("Resetting current trick...");
        setCurrentTrick([]);
        setCenteredCard(null);
      }, 500); // Slight delay for UI updates
    }
  };

  return (
    <>
      {children({
        currentTrick,
        validatePlay,
        playCard,
      })}
    </>
  );
};

export default TrickManager;