"use client";

import React, { useState } from "react";
import { getCardSuit, playerHasSuit } from "../../lib/gameUtils";

interface TrickManagerProps {
  players: number;
  trumpSuit: string | null;
  hands: string[][];
  onTrickComplete: (trick: { player: number; card: string }[]) => void;
  children: (props: {
    leadingSuit: string | null;
    currentTrick: { player: number; card: string }[];
    validatePlay: (card: string, playerIndex: number) => boolean;
    playCard: (card: string, playerIndex: number) => void;
    setLeadingSuit: React.Dispatch<React.SetStateAction<string | null>>;
    setCurrentTrick: React.Dispatch<React.SetStateAction<{ player: number; card: string }[]>>;
  }) => React.ReactNode;
}

const TrickManager: React.FC<TrickManagerProps> = ({
  players,
  trumpSuit,
  hands,
  onTrickComplete,
  children,
}) => {
  const [leadingSuit, setLeadingSuit] = useState<string | null>(null);
  const [currentTrick, setCurrentTrick] = useState<{ player: number; card: string }[]>([]);

  const validatePlay = (card: string, playerIndex: number): boolean => {
    const cardSuit = getCardSuit(card);
    if (!leadingSuit) {
      setLeadingSuit(cardSuit);
      return true;
    }
    const hasLeadingSuit = playerHasSuit(hands[playerIndex], leadingSuit);
    if (hasLeadingSuit && cardSuit !== leadingSuit) return false;
    return true;
  };

  const playCard = (card: string, playerIndex: number) => {
    const cardSuit = getCardSuit(card);
    if (!leadingSuit) setLeadingSuit(cardSuit);
    const updatedTrick = [...currentTrick, { player: playerIndex, card }];
    setCurrentTrick(updatedTrick);
    if (updatedTrick.length === players) {
      onTrickComplete(updatedTrick);
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
        setLeadingSuit, // Expose to children
        setCurrentTrick, // Expose to children
      })}
    </>
  );
};

export default TrickManager;
