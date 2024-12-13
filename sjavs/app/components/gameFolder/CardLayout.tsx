// CardLayout.tsx

"use client";

import React, { useState, useEffect } from "react";
import Card from "./Cards";
import TrickManager from "./TrickManager";
import TurnManager from "./TurnManager";
import ScoreTable from "./ScoreTable"; 
import Player from "./Player"; // Import the Player component
import styles from "./CardLayout.module.css";
import {
  shuffleDeck,
  dealCards,
  chooseTrump,
  determineTrickWinner, 
  calculateTrickPoints
} from "../../../lib/gameUtils";

const CardLayout: React.FC = () => {
  const [hands, setHands] = useState<string[][]>([]); // Hands for each player
  const [trumpSuit, setTrumpSuit] = useState<string | null>(null); // Chosen trump suit
  const [centeredCard, setCenteredCard] = useState<string | null>(null); // Track the centered card
  const [roundScores, setRoundScores] = useState<number[][]>([]); // Each entry is [team1Score, team2Score]
  const [currentTrick, setCurrentTrick] = useState<{ player: number; card: string }[]>([]); // Current trick state

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

  useEffect(() => {
    startGame(); // Start the game automatically when the component mounts
  }, []);

  const handleTrickComplete = (
    trick: { player: number; card: string }[],
    setStartingPlayer: (player: number) => void
  ) => {
    if (trick.length !== 4) {
      console.error("Incomplete trick: Not all players have played.");
      return;
    }
  
    console.log("Trick is complete:", trick);
  
    const trickWinner = determineTrickWinner(trick, trumpSuit);
    const trickPoints = calculateTrickPoints(trick);
  
    console.log(`Player ${trickWinner + 1} wins the trick. Points: ${trickPoints}`);
  
    const winningTeam = trickWinner % 2 === 0 ? 0 : 1;
  
    setRoundScores((prevScores) => {
      const newScores = [...prevScores];
  
      // Check if this is the first round (no previous rounds exist)
      if (newScores.length === 0) {
        // Initialize the first round with scores
        const initialScores = [0, 0, 0]; // [Team 1 Total, Team 2 Total, Points Gained]
        initialScores[winningTeam] += trickPoints; // Add points for the winning team
        initialScores[2] = trickPoints; // Record points gained
        newScores.push(initialScores); // Push the first round
      } else {
        // Handle subsequent rounds
        const lastRound = newScores[newScores.length - 1];
        const updatedTotals = [...lastRound]; // Copy the last round totals
  
        updatedTotals[winningTeam] += trickPoints; // Update team total for the winner
        newScores.push([...updatedTotals.slice(0, 2), trickPoints]); // Add a new row with updated totals
      }
  
      console.log(
        `Updated Scores: Team 1 Total: ${newScores[newScores.length - 1][0]}, Team 2 Total: ${newScores[newScores.length - 1][1]}, Points Gained: ${trickPoints}`
      );
  
      return newScores;
    });
  
    setStartingPlayer(trickWinner); // Set the next starting player
  };
  
  
  
  
  return (
    <TurnManager players={hands.length} startingPlayer={0}>
      {({ currentTurn, nextTurn, setStartingPlayer }) => (
        <TrickManager
          players={hands.length}
          trumpSuit={trumpSuit}
          hands={hands}
          setHands={setHands} // Pass the setHands function to update player hands
          setCenteredCard={setCenteredCard} // Pass setCenteredCard to display the played card
          setStartingPlayer={setStartingPlayer} // Pass setStartingPlayer to TrickManager
          onTrickComplete={(trick) => handleTrickComplete(trick, setStartingPlayer)} // Process when the trick is complete
        >
          {({ leadingSuit, validatePlay, playCard }) => (
            <div className={styles.gameContainer}>
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
                <Player
                  key={playerIndex}
                  playerIndex={playerIndex}
                  hand={hand}
                  currentTurn={currentTurn}
                  validatePlay={validatePlay}
                  playCard={playCard}
                  setCenteredCard={setCenteredCard}
                  setHands={setHands}
                  nextTurn={nextTurn}
                />
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
