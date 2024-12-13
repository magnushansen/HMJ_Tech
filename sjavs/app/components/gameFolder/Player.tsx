// Player.tsx

import React from "react";
import Card from "./Cards";
import styles from "./CardLayout.module.css";

interface PlayerProps {
  playerIndex: number;
  hand: string[];
  currentTurn: number;
  validatePlay: (card: string, playerIndex: number) => boolean;
  playCard: (card: string, playerIndex: number) => void;
  setCenteredCard: (card: string | null) => void;
  setHands: React.Dispatch<React.SetStateAction<string[][]>>;
  nextTurn: () => void;
}

const Player: React.FC<PlayerProps> = ({
  playerIndex,
  hand,
  currentTurn,
  validatePlay,
  playCard,
  setCenteredCard,
  setHands,
  nextTurn,
}) => {
  return (
    <div className={`${styles.hand} ${styles[`player${playerIndex + 1}`]}`}>
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
                //   `Invalid play! You must follow the ${leadingSuit} suit or play a ${trumpSuit} card if possible.`
                );
              }
            }
          }}
          isClickable={playerIndex === currentTurn && validatePlay(card, playerIndex)}
          isCentered={false}
        />
      ))}
    </div>
  );
};

export default Player;