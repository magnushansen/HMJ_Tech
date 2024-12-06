import React from "react";
import styles from "./CardAnimation.module.css";

interface StartGameButtonProps {
  onClick: () => void;
}

const StartGameButton: React.FC<StartGameButtonProps> = ({ onClick }) => {
  return (
    <button id="start-game-button" onClick={onClick} className={styles.startButton}>
      Start Game
    </button>
  );
};

export default StartGameButton;