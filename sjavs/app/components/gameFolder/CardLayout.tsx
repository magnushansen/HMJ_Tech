"use client";

import React, { useState, useEffect } from "react";
import Card from "./Cards";
import TrickManager from "./TrickManager";
import TurnManager from "./TurnManager";
import ScoreTable from "./ScoreTable";
import Player from "./Player";
import styles from "./CardLayout.module.css";
import {
  shuffleDeck,
  dealCards,
  chooseTrump,
  determineTrickWinner,
  calculateTrickPoints,
} from "../../../lib/gameUtils";

const CardLayout: React.FC = () => {
  const [hands, setHands] = useState<string[][]>([]); // Hands for each player
  const [trumpSuit, setTrumpSuit] = useState<string | null>(null); // Chosen trump suit
  const [centeredCard, setCenteredCard] = useState<string | null>(null); // Track the centered card
  const [roundScores, setRoundScores] = useState<number[][]>([]); // Each entry is [team1Score, team2Score]

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

  // UseEffect to reshuffle and redeal cards if all players are out of cards
  useEffect(() => {
    const allHandsEmpty = hands.every((hand) => hand.length === 0);

    if (allHandsEmpty) {
      console.log("All players are out of cards. Reshuffling, redealing, and resetting scores...");

      const newDeck = shuffleDeck(); // Shuffle a new deck
      const newHands = dealCards(newDeck); // Deal cards to players
      setHands(newHands); // Reset the hands

      setRoundScores([]); // Reset the scoreboard for a new round
    }
  }, [hands]);

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

      if (newScores.length === 0) {
        const initialScores = [0, 0, 0]; // [Team 1 Total, Team 2 Total, Points Gained]
        initialScores[winningTeam] += trickPoints;
        initialScores[2] = trickPoints;
        newScores.push(initialScores);
      } else {
        const lastRound = newScores[newScores.length - 1];
        const updatedTotals = [...lastRound];
        updatedTotals[winningTeam] += trickPoints;
        newScores.push([...updatedTotals.slice(0, 2), trickPoints]);
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
          setHands={setHands}
          setCenteredCard={setCenteredCard}
          setStartingPlayer={setStartingPlayer}
          onTrickComplete={(trick) => handleTrickComplete(trick, setStartingPlayer)}
        >
          {({ leadingSuit, validatePlay, playCard }) => (
            <div className={styles.gameContainer}>
              {trumpSuit && <p className={styles.trumpSuit}>Trump Suit: {trumpSuit}</p>}
              <p className={styles.currentTurn}>Player Turn: {currentTurn + 1}</p>

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

              <ScoreTable roundScores={roundScores} />
            </div>
          )}
        </TrickManager>
      )}
    </TurnManager>
  );
};

export default CardLayout;
