// lib/scoring.js

let doubleNextGameScore = false; // Keeps track if the next game's score should be doubled

// Initialize Score Sheet
const scoreSheet = {
    "We": 24,
    "They": 24,
};

export function printScoreSheet() {
    console.log("\nScore Sheet:");
    console.log("-------------");
    console.log(`| We   | They |`);
    console.log("-------------");
    console.log(`| ${scoreSheet["We"].toString().padEnd(4)} | ${scoreSheet["They"].toString().padEnd(4)} |`);
    console.log("-------------");
    if (scoreSheet["We"] === 6) console.log("We are on the hook!");
    if (scoreSheet["They"] === 6) console.log("They are on the hook!");
    console.log("");
}

// Function to update the score sheet
export function updateScoreSheet(winningTeam, points) {
    scoreSheet[winningTeam] -= points;

    // Check if a team has won the rubber
    if (scoreSheet[winningTeam] <= 0) {
        const losingTeam = winningTeam === "We" ? "They" : "We";
        if (scoreSheet[losingTeam] === 24) {
            console.log(`${winningTeam} has won a double victory!`);
        }
        console.log(`${winningTeam} has won the rubber!`);
        console.log("Recording a cross at the bottom of the score sheet.");
        printScoreSheet();
        return true; // Signal game end
    }
    return false; // Continue game if no team has won
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
