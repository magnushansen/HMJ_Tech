// lib/scoreSheet.js

// Initialize the score sheet with starting points
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

// Function to update the score for a specific team
export function updateScore(winningTeam, points) {
    scoreSheet[winningTeam] -= points;
}

// Function to check if a team has won the rubber
export function checkForRubberWin(winningTeam) {
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
