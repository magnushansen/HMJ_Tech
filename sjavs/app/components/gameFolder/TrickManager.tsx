"use client";

import React, { useState } from "react";
import {
  determineTrickWinner,
  getCardSuit,
  playerHasSuit,
  shuffleDeck,
  dealCards,
} from "../../../lib/gameUtils";

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
  const [leadingSuit, setLeadingSuit] = useState<string | null>(null); // Suit of the first card played
  const [currentTrick, setCurrentTrick] = useState<{ player: number; card: string }[]>([]); // Cards played in the current trick

  const validatePlay = (card: string, playerIndex: number): boolean => {
    const cardSuit = getCardSuit(card);

    if (!leadingSuit) return true; // If no leading suit, any card is valid

    const hasLeadingSuit = playerHasSuit(hands[playerIndex], leadingSuit);
    if (hasLeadingSuit) {
      return cardSuit === leadingSuit; // Must follow the leading suit
    }

    // const hasTrumpSuit = trumpSuit
    //   ? playerHasSuit(hands[playerIndex], trumpSuit)
    //   : false;
    // if (hasTrumpSuit) {
    //   return cardSuit === trumpSuit; // Must play trump if available
    // }

    return true; // If no valid options, any card can be played
  };

  const playCard = (card: string, playerIndex: number) => {
    if (currentTrick.find((t) => t.player === playerIndex)) {
      console.error(`Player ${playerIndex + 1} has already played.`);
      return;
    }

    const cardSuit = getCardSuit(card);

    if (!leadingSuit) setLeadingSuit(cardSuit);

    const updatedTrick = [...currentTrick, { player: playerIndex, card }];
    setCurrentTrick(updatedTrick);

    setHands((prevHands) =>
      prevHands.map((hand, index) =>
        index === playerIndex ? hand.filter((c) => c !== card) : hand
      )
    );

    setCenteredCard(card);

    if (updatedTrick.length === players) {
      onTrickComplete(updatedTrick); // Process completed trick

      const trickWinner = determineTrickWinner(updatedTrick, trumpSuit);
      setStartingPlayer(trickWinner);

      setTimeout(() => {
        setCurrentTrick([]);
        setLeadingSuit(null);
        setCenteredCard(null);

        // Check if all hands are empty
        const allHandsEmpty = hands.every((hand) => hand.length === 0);
        if (allHandsEmpty) {
          console.log("All players are out of cards. Reshuffling...");
          const newDeck = shuffleDeck(); // Create a new deck
          const newHands = dealCards(newDeck); // Deal new hands
          setHands(newHands); // Update the hands
        }
      }, 500);
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
