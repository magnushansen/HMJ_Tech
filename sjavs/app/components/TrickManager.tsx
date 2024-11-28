"use client";

import React, { useState } from "react";
import { getCardSuit, playerHasSuit } from "../../lib/gameUtils";

interface TrickManagerProps {
  players: number; // Number of players
  trumpSuit: string | null; // Current trump suit
  hands: string[][]; // Current hands of all players
  onTrickComplete: (trick: { player: number; card: string }[]) => void; // Callback when trick is complete
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
  onTrickComplete,
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

    console.log(`Player ${playerIndex + 1} attempting to play ${card}`);
    console.log(`Leading Suit: ${leadingSuit}, Trump Suit: ${trumpSuit}`);
    console.log(`Player has leading suit: ${playerHasSuit(hands[playerIndex], leadingSuit)}`);
    console.log(`Player has trump suit: ${trumpSuit ? playerHasSuit(hands[playerIndex], trumpSuit) : false}`);

    // If no leading suit, it's the first card of the trick
    if (!leadingSuit) {
      setLeadingSuit(cardSuit); // Set leading suit for the new trick
      console.log(`Validation Result: true (no leading suit yet)`);
      return true; // Any card is valid for the first play
    }

    // Check if the player has cards of the leading suit
    const hasLeadingSuit = playerHasSuit(hands[playerIndex], leadingSuit);

    if (hasLeadingSuit) {
      // Must follow the leading suit
      const isValid = cardSuit === leadingSuit;
      console.log(`Validation Result: ${isValid} (must follow leading suit)`);
      return isValid;
    }

    // If the player does not have the leading suit:
    const hasTrumpSuit = trumpSuit ? playerHasSuit(hands[playerIndex], trumpSuit) : false;

    if (hasTrumpSuit) {
      // Must play a trump suit card if available
      const isValid = cardSuit === trumpSuit;
      console.log(`Validation Result: ${isValid} (must play trump suit if available)`);
      return isValid;
    }

    // If the player has neither the leading suit nor trump suit, any card is valid
    console.log(`Validation Result: true (no leading suit or trump suit available)`);
    return true;
  };

  /**
   * Handles playing a card, updating the trick and leading suit as necessary.
   * @param card - The card being played
   * @param playerIndex - The index of the player playing the card
   */
  const playCard = (card: string, playerIndex: number) => {
    const cardSuit = getCardSuit(card);

    // Set the leading suit if it's the first card played in the trick
    if (!leadingSuit) {
      setLeadingSuit(cardSuit);
    }

    // Add the card to the current trick
    const updatedTrick = [...currentTrick, { player: playerIndex, card }];
    setCurrentTrick(updatedTrick);

    // Check if the trick is complete (all players have played a card)
    if (updatedTrick.length === players) {
      console.log("Trick is complete:", updatedTrick);

      // Notify the parent component about the completed trick
      onTrickComplete(updatedTrick);

      // Reset for the next trick
      setLeadingSuit(null);
      setCurrentTrick([]);
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
