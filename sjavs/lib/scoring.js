// lib/scoring.js
export { updateScores, calculateFinalScore };

import { calculateTrickPoints } from './gameUtils';

function updateScores(gameState) {
    const team1Score = gameState.team1.tricks.reduce((sum, trick) => sum + calculateTrickPoints(trick), 0);
    const team2Score = gameState.team2.tricks.reduce((sum, trick) => sum + calculateTrickPoints(trick), 0);
    gameState.scores.team1 += team1Score;
    gameState.scores.team2 += team2Score;
}

export function calculateFinalScore(teamPoints, isTrumpClubs) {
    if (teamPoints === 120) {
        // Winning all tricks
        return isTrumpClubs ? 16 : 12;
    } else if (teamPoints >= 90) {
        // Scoring between 90 - 120 points
        return isTrumpClubs ? 8 : 4;
    } else if (teamPoints >= 61) {
        // Scoring between 61 - 89 points
        return isTrumpClubs ? 4 : 2;
    } else if (teamPoints >= 31) {
        // Opponents score between 31 - 59 points
        return isTrumpClubs ? -8 : -4;
    } else if (teamPoints > 0) {
        // Opponents score between 0 - 30 points
        return isTrumpClubs ? -16 : -8;
    } else {
        // Losing all tricks
        return -16;
    }
}
