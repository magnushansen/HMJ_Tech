const {
    shuffleDeck,
    dealCards,
    getCardSuit,
    getCardValue,
    playerHasSuit,
    determineTrickWinner,
    calculateTrickPoints,
    chooseTrump
} = require('./lib/gameUtils');

console.log("Starting the game...");

// Initialize Score Sheet
const scoreSheet = {
    "We": 24,
    "They": 24,
};

function printScoreSheet() {
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
function updateScoreSheet(winningTeam, points) {
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
function calculateFinalScore(team1Points, team2Points, trumpSuit) {
    const CLUB_TRUMP_MULTIPLIER = trumpSuit === '♣' ? 2 : 1;

    if (team1Points === 120) {
        return [12 * CLUB_TRUMP_MULTIPLIER, 0];
    } else if (team1Points >= 90) {
        return [4 * CLUB_TRUMP_MULTIPLIER, 0];
    } else if (team1Points >= 61) {
        return [2 * CLUB_TRUMP_MULTIPLIER, 0];
    } else if (team1Points >= 31) {
        return [0, 4 * CLUB_TRUMP_MULTIPLIER];
    } else if (team1Points >= 0) {
        return [0, 8 * CLUB_TRUMP_MULTIPLIER];
    } else {
        return [0, 16 * CLUB_TRUMP_MULTIPLIER];
    }
}

// Function to play a single trick
function playTrick(hands, gameState, startingPlayerIndex) {
    console.log("Playing a trick...");
    gameState.currentTrick = [];
    gameState.leadingSuit = null;

    // Start the trick with the player who won the last trick
    for (let i = 0; i < 4; i++) {
        const playerIndex = (startingPlayerIndex + i) % 4; // Rotate starting from the specified player
        const playerHand = hands[playerIndex];

        // Determine which card to play
        let card;
        if (gameState.leadingSuit) {
            const cardsOfLeadingSuit = playerHand.filter(c => getCardSuit(c) === gameState.leadingSuit);
            if (cardsOfLeadingSuit.length > 0) {
                card = cardsOfLeadingSuit.pop();
                playerHand.splice(playerHand.indexOf(card), 1);
            } else {
                card = playerHand.pop();
            }
        } else {
            card = playerHand.pop();
            gameState.leadingSuit = getCardSuit(card);
        }

        const suit = getCardSuit(card);
        const value = getCardValue(card);
        console.log(`Player ${playerIndex + 1} plays ${card} (Suit: ${suit}, Value: ${value})`);

        gameState.currentTrick.push({ player: playerIndex, card });
    }

    const trickWinner = determineTrickWinner(gameState.currentTrick, gameState.trumpSuit);
    console.log(`Player ${trickWinner + 1} wins the trick!`);

    const trickPoints = calculateTrickPoints(gameState.currentTrick);
    const team = trickWinner % 2 === 0 ? 0 : 1;
    gameState.scores[team] += trickPoints;

    console.log(`Points for this trick: ${trickPoints}`);
    console.log(`Current Score - Team 1: ${gameState.scores[0]}, Team 2: ${gameState.scores[1]}\n`);

    return trickWinner; // Return the index of the player who won the trick
}

// Main game loop
let gameEnded = false;
while (!gameEnded) {
    console.log("\nStarting a new round...\n");

    // Initialize hands and determine trump suit
    let hands, trumpSuit;
    do {
        const deck = shuffleDeck();
        hands = dealCards(deck);
        trumpSuit = chooseTrump(hands);
    } while (!trumpSuit);

    // Display each player's hand after trump suit is determined
    console.log("\nPlayer Hands (after trump is chosen):");
    hands.forEach((hand, index) => {
        console.log(`Player ${index + 1}: ${hand.join(', ')}`);
    });
    console.log(""); // Add a blank line for readability

    const gameState = {
        currentTrick: [],
        leadingSuit: null,
        scores: [0, 0], // Team 1 (Players 1 & 3) and Team 2 (Players 2 & 4)
        trumpSuit
    };

    // Start with Player 1 as the first leader of the round
    let currentLeader = 0;

    // Play four tricks in a round
    for (let i = 0; i < 4; i++) {
        console.log(`--- Trick ${i + 1} ---`);
        currentLeader = playTrick(hands, gameState, currentLeader); // Update leader after each trick
    }

    // Calculate final scores for the round
    const team1Score = gameState.scores[0];
    const team2Score = gameState.scores[1];
    const [team1FinalScore, team2FinalScore] = calculateFinalScore(team1Score, team2Score, trumpSuit);

    // Update the score sheet based on the round result
    if (team1FinalScore > team2FinalScore) {
        gameEnded = updateScoreSheet("We", team1FinalScore);
    } else if (team2FinalScore > team1FinalScore) {
        gameEnded = updateScoreSheet("They", team2FinalScore);
    }

    // Print the updated score sheet after each round
    printScoreSheet();
}

console.log("Game over!");
