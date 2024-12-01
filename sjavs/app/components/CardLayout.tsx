"use client";

import React, { useState } from "react";
import Card from "./Cards";
import TrickManager from "./TrickManager";
import TurnManager from "./TurnManager";
import ScoreTable from "./ScoreTable"; // Import the ScoreTable component
import styles from "./CardLayout.module.css";
import {
  shuffleDeck,
  dealCards,
  chooseTrump,
  calculateTrickPoints,
  determineTrickWinner // Add this line
} from "../../lib/gameUtils";


const CardLayout: React.FC = () => {
  const [hands, setHands] = useState<string[][]>([]); // Hands for each player
  const [trumpSuit, setTrumpSuit] = useState<string | null>(null); // Chosen trump suit
  const [centeredCard, setCenteredCard] = useState<string | null>(null); // Track the centered card
  const [roundScores, setRoundScores] = useState<number[][]>([]); // Each entry is [team1Score, team2Score]
  const [currentTrick, setCurrentTrick] = useState<{ player: number; card: string }[]>([]);

  // Function to start the game
  const startGame = () => {
    const deck = shuffleDeck();
    const dealtHands = dealCards(deck);
    const trumpInfo = chooseTrump(dealtHands);

    if (trumpInfo) {
      setHands(dealtHands); // Set player hands
      setTrumpSuit(trumpInfo.trumpSuit); // Set the trump suit
      setRoundScores([]); // Reset scores for a new game
    } else {
      alert("Re-dealing as no player has a strong trump suit.");
      startGame(); // Retry if trump is not chosen
    }
  };

  // Function to handle when a round is complete
  const handleRoundComplete = () => {
    const team1Score = calculateTeamScore(0); // Calculate Team 1's score
    const team2Score = calculateTeamScore(1); // Calculate Team 2's score

    // Update the round scores state
    setRoundScores((prevScores) => [...prevScores, [team1Score, team2Score]]);
  };

  const calculateTeamScore = (team: number): number => {
    const teamPlayers = team === 0 ? [0, 2] : [1, 3];
    return currentTrick
      .filter((play) => teamPlayers.includes(play.player))
      .reduce((acc, play) => acc + calculateTrickPoints([play]), 0);
  };

  // Function to handle when a trick is completed
  const handleTrickComplete = (trick: { player: number; card: string }[]) => {
    console.log("Trick is complete:", trick);

    // Example: Determine the winner of the trick (logic from your gameUtils)
    const trickWinner = determineTrickWinner(trick, trumpSuit);
    console.log(`Player ${trickWinner + 1} wins the trick.`);

    // Reset for the next trick
    setLeadingSuit(null); // Reset the leading suit for the next round
    setCurrentTrick([]);
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
          {({ leadingSuit, validatePlay, playCard }) => (
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

              {/* Score Table */}
              <ScoreTable roundScores={roundScores} />
            </div>
          )}
        </TrickManager>
      )}
    </TurnManager>
  );
};

export default CardLayout;
function setLeadingSuit(arg0: null) {
  throw new Error("Function not implemented.");
}

