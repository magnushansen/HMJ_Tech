//TrickManager.tsx

"use client";

import React, { useState } from "react";
import { determineTrickWinner, getCardSuit, playerHasSuit } from "../../../lib/gameUtils";

interface TrickManagerProps {
  players: number; // Number of players
  trumpSuit: string | null; // Current trump suit
  hands: string[][]; // Current hands of all players
  setHands: React.Dispatch<React.SetStateAction<string[][]>>; // Function to update hands
  setCenteredCard: React.Dispatch<React.SetStateAction<string | null>>; // Function to set centered card
  onTrickComplete: (trick: { player: number; card: string }[]) => void; // Callback when trick is complete
  setStartingPlayer: (player: number) => void; // Function to set the starting player for the next trick
  children: (props: {
    leadingSuit: string | null;
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
  setStartingPlayer,
  children,
}) => {
  const [leadingSuit, setLeadingSuit] = useState<string | null>(null); // The suit of the first card played in a trick
  const [currentTrick, setCurrentTrick] = useState<{ player: number; card: string }[]>([]); // Cards currently played in the ongoing trick

  /**
   * Validates whether the player can legally play the selected card.
   * @param card - The card the player is attempting to play
   * @param playerIndex - The index of the player attempting to play the card
   * @returns {boolean} - Whether the card can be played
   */
  const validatePlay = (card: string, playerIndex: number): boolean => {
    const cardSuit = getCardSuit(card);

    // If there is no leading suit yet, any card is valid
    if (!leadingSuit) {
      return true;
    }

    // Check if the player has cards of the leading suit
    const hasLeadingSuit = playerHasSuit(hands[playerIndex], leadingSuit);
    if (hasLeadingSuit) {
      return cardSuit === leadingSuit; // Must follow the leading suit
    }

    // Check if the player has trump cards
    const hasTrumpSuit = trumpSuit ? playerHasSuit(hands[playerIndex], trumpSuit) : false;
    if (hasTrumpSuit) {
      return cardSuit === trumpSuit; // Must play trump suit if available
    }

    // If no leading suit or trump cards, any card is valid
    return true;
  };

  const playCard = (card: string, playerIndex: number) => {
    // Prevent playing a card if the player has already played this turn
    if (currentTrick.find((t) => t.player === playerIndex)) {
      console.error(`Player ${playerIndex + 1} has already played in this trick.`);
      return;
    }

    const cardSuit = getCardSuit(card);

    // Set the leading suit if it's the first card in the trick
    if (!leadingSuit) {
      setLeadingSuit(cardSuit);
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

      // Call the parent callback for trick completion
      onTrickComplete(updatedTrick);

      // Determine the winner of the trick and set the starting player for the next trick
      const trickWinner = determineTrickWinner(updatedTrick, trumpSuit);
      console.log(`Player ${trickWinner + 1} won the trick.`);
      setStartingPlayer(trickWinner);

      // Reset the trick after processing
      setTimeout(() => {
        console.log("Resetting current trick and leading suit...");
        setCurrentTrick([]);
        setLeadingSuit(null);
        setCenteredCard(null);
      }, 500); // Slight delay for UI updates
    }
  };

  return (
    <>
      {children({
        leadingSuit,
        currentTrick,
        validatePlay,
        playCard,
      })}
    </>
  );
};

export default TrickManager;
