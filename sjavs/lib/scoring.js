// lib/scoring.js

import { printScoreSheet, updateScore, checkForRubberWin } from './scoreSheet.js';

let doubleNextGameScore = false; // Keeps track if the next game's score should be doubled

// Function to update the score sheet based on the winning team and points scored nnlænlænm
export function updateScoreSheet(winningTeam, points) {
    updateScore(winningTeam, points); // Update score using scoreSheet.js

    // Check if a team has won the rubber
    const gameEnded = checkForRubberWin(winningTeam);
    if (gameEnded) {
        printScoreSheet();
    }
    return gameEnded;
}

// Function to calculate the final score based on the rules
export function calculateFinalScore(team1Points, team2Points, trumpSuit) {
    const CLUB_TRUMP_MULTIPLIER = trumpSuit === '♣' ? 2 : 1;
    const scoreMultiplier = doubleNextGameScore ? 2 : 1; // Double score if the last game was a tie

    if (team1Points === 120) {
        return [12 * CLUB_TRUMP_MULTIPLIER * scoreMultiplier, 0];
    } else if (team1Points >= 90) {
        return [4 * CLUB_TRUMP_MULTIPLIER * scoreMultiplier, 0];
    } else if (team1Points >= 61) {
        return [2 * CLUB_TRUMP_MULTIPLIER * scoreMultiplier, 0];
    } else if (team1Points === 60 && team2Points === 60) {
        console.log("Both teams have 60 points - no score recorded. Next game value will be doubled.");
        doubleNextGameScore = true; // Set flag to double the next game's score
        return [0, 0]; // No score recorded this round
    } else if (team1Points >= 31) {
        return [0, 4 * CLUB_TRUMP_MULTIPLIER * scoreMultiplier];
    } else if (team1Points >= 0) {
        return [0, 8 * CLUB_TRUMP_MULTIPLIER * scoreMultiplier];
    } else {
        return [0, 16 * CLUB_TRUMP_MULTIPLIER * scoreMultiplier];
    }
}

// Reset the doubleNextGameScore flag after a non-tie game
export function resetDoubleNextGameScore() {
    doubleNextGameScore = false;
}
