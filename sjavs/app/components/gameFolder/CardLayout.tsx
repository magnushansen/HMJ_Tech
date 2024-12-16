"use client";

import React, { useState, useEffect } from "react";
import Card from "./Cards";
import TrickManager from "./TrickManager";
import TurnManager from "./TurnManager";
import ScoreTable from "./ScoreTable";
import GameScoreboard from "./GameScoreboard";
import ResetRound from "./ResetRound";
import Player from "./Player";
import styles from "./CardLayout.module.css";
import { calculateFinalScore } from "../../../lib/scoring";
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
  const [roundScores, setRoundScores] = useState<number[][]>([]); // Each entry is [team1Score, team2Score, pointsGained]
  const [gameScores, setGameScores] = useState({ team1: 24, team2: 24 }); // Remaining points for each team
  const [scoreHistory, setScoreHistory] = useState<
    { round: number; team1: number; team2: number; change: string }[]
  >([]); // Tracks score history
  const [tricksPlayed, setTricksPlayed] = useState(0); // Track tricks played in a round

  const startGame = () => {
    const deck = shuffleDeck();
    const dealtHands = dealCards(deck);
    const trumpInfo = chooseTrump(dealtHands);

    if (trumpInfo) {
      setHands(dealtHands); // Set player hands
      setTrumpSuit(trumpInfo.trumpSuit); // Set the trump suit
      setRoundScores([]); // Reset scores for a new game
      setGameScores({ team1: 24, team2: 24 }); // Reset game scores
      setScoreHistory([]); // Clear the score history
      setTricksPlayed(0); // Reset the trick counter
    } else {
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
  
      return newScores;
    });
  
    setTricksPlayed((prev) => prev + 1);
  
    if (tricksPlayed + 1 === 8) {
      console.log("All tricks are complete. Resetting round.");
      setTricksPlayed(0);
  
      const lastRoundScores = roundScores[roundScores.length - 1] || [0, 0, 0];
      const team1Points = lastRoundScores[0];
      const team2Points = lastRoundScores[1];
  
      const [team1Decrement, team2Decrement] = calculateFinalScore(
        team1Points,
        team2Points,
        trumpSuit
      );
  
      const updatedScores = {
        team1: Math.max(0, gameScores.team1 - team1Decrement),
        team2: Math.max(0, gameScores.team2 - team2Decrement),
      };
  
      setGameScores(updatedScores);
  
      if (updatedScores.team1 === 0 || updatedScores.team2 === 0) {
        const winner = updatedScores.team1 === 0 ? "Team 1" : "Team 2";
        handleGameEnd(winner);
        return;
      }
  
      setScoreHistory((prevHistory) => [
        ...prevHistory,
        {
          round: roundScores.length,
          team1: updatedScores.team1,
          team2: updatedScores.team2,
          change: `-${team1Decrement} / -${team2Decrement}`,
        },
      ]);
  
      // Reset the round scores for the next round
      setRoundScores([]);
  
      const newDeck = shuffleDeck();
      const newHands = dealCards(newDeck);
      setHands(newHands);
    }
  
    setStartingPlayer(trickWinner); // Set the next starting player
  };
  

  const handleGameEnd = (winner: string) => {
    alert(`Game Over! ${winner} wins!`);
    startGame(); // Restart the game if there's a winner
  };

  return (
    <div className={styles.gameContainer}>
      <h1>Sjavs</h1>

      {/* Game Scoreboard */}
      <GameScoreboard
        trumpSuit={trumpSuit || "N/A"}
        history={scoreHistory}
        scores={gameScores}
        winner={
          gameScores.team1 === 0
            ? "Team 1"
            : gameScores.team2 === 0
            ? "Team 2"
            : null
        }
      />

      {/* Turn Manager */}
      <TurnManager players={hands.length} startingPlayer={0}>
        {({ currentTurn, nextTurn, setStartingPlayer }) => (
          <TrickManager
            players={hands.length}
            trumpSuit={trumpSuit}
            hands={hands}
            setHands={setHands}
            setCenteredCard={setCenteredCard}
            setStartingPlayer={setStartingPlayer}
            onTrickComplete={(trick) =>
              handleTrickComplete(trick, setStartingPlayer)
            }
          >
            {({ leadingSuit, validatePlay, playCard }) => (
              <div>
                {trumpSuit && <p>Trump Suit: {trumpSuit}</p>}
                <p>Player Turn: {currentTurn + 1}</p>

                {centeredCard && (
                  <Card
                    key={centeredCard}
                    rank={centeredCard.split(" ")[0]}
                    suit={centeredCard.split(" ")[1]}
                    isCentered={true}
                    isClickable={false}
                    onClick={() => setCenteredCard(null)}
                  />
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
    </div>
  );
};

export default CardLayout;
