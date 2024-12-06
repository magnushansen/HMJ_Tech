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

  const handleTrickComplete = (trick: { player: number; card: string }[]) => {
    // Ensure the trick has exactly the right number of cards before processing
    if (trick.length !== 4) {
      console.error("Incomplete trick: Not all players have played.");
      return;
    }
  
    console.log("Trick is complete:", trick, "Derp");
  
    // Determine the winner and calculate the points
    const trickWinner = determineTrickWinner(trick, trumpSuit);
    const trickPoints = calculateTrickPoints(trick);
  
    console.log(`Player ${trickWinner + 1} wins the trick. Points: ${trickPoints}`);
  
    // Determine which team gets the points
    const winningTeam = trickWinner % 2 === 0 ? 0 : 1;
  
    // Safely update the round scores
    setRoundScores((prevScores) => {
      // Create a copy of the current scores
      const newScores = [...prevScores];
  
      // Initialize scores for a new round if needed
      if (newScores.length === 0 || newScores[newScores.length - 1].length < 2) {
        newScores.push([0, 0]);
      }
  
      // Add the points to the appropriate team
      newScores[newScores.length - 1][winningTeam] += trickPoints;
  
      console.log(
        `Updated Scores: Team 1: ${newScores[newScores.length - 1][0]}, Team 2: ${newScores[newScores.length - 1][1]}`)
      
  
      setCurrentTrick([]); // Clear the trick
      return newScores;
    })
  
    // Reset the trick after processing
    setTimeout(() => {
      console.log("Resetting current trick...");
    }, 500); // Small delay for UI updates
  };
  

  return (
    <TurnManager players={hands.length}>
      {({ currentTurn, nextTurn }) => (
        <TrickManager
          players={hands.length}
          trumpSuit={trumpSuit}
          hands={hands}
          setHands={setHands} // Pass the setHands function to update player hands
          setCenteredCard={setCenteredCard} // Pass setCenteredCard to display the played card
          onTrickComplete={handleTrickComplete} // Process when the trick is complete
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