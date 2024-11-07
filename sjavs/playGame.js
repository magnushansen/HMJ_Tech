//playGame.js

const {
    shuffleDeck,
    dealCards,
    getCardSuit,
    getCardValue,
    playerHasSuit,
    determineTrickWinner,
    calculateTrickPoints
} = require('./lib/gameUtils');

console.log("Starting the game...");

// Step 1: Initialize the Game
const deck = shuffleDeck();
const hands = dealCards(deck);

// Define the trump suit
const trumpSuit = '♣';
console.log(`The trump suit for this round is ${trumpSuit}.`);

// Display each player's hand
hands.forEach((hand, index) => {
    console.log(`Player ${index + 1} hand: ${hand.join(', ')}`);
});

// Define game state
const gameState = {
    currentTrick: [],
    leadingSuit: null,
    scores: [0, 0], // Team 1 (Players 1 & 3) and Team 2 (Players 2 & 4)
};

// Function to play a single trick
function playTrick() {
    console.log("Playing a trick...");
    gameState.currentTrick = [];
    gameState.leadingSuit = null;

    for (let i = 0; i < 4; i++) {
        const playerHand = hands[i];

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
        console.log(`Player ${i + 1} plays ${card} (Suit: ${suit}, Value: ${value})`);

        gameState.currentTrick.push({ player: i, card });
    }

    const trickWinner = determineTrickWinner(gameState.currentTrick, trumpSuit);
    console.log(`Player ${trickWinner + 1} wins the trick!`);

    const trickPoints = calculateTrickPoints(gameState.currentTrick);
    const team = trickWinner % 2 === 0 ? 0 : 1;
    gameState.scores[team] += trickPoints;

    console.log(`Points for this trick: ${trickPoints}`);
    console.log(`Current Score - Team 1: ${gameState.scores[0]}, Team 2: ${gameState.scores[1]}\n`);
}

// Start the round of playing tricks
console.log("Starting the round...\n");
for (let i = 0; i < 4; i++) { // Simulate 4 tricks in a round
    console.log(`--- Trick ${i + 1} ---`);
    playTrick();
}

// Determine Round Winner
console.log("Round over!");
const team1Score = gameState.scores[0];
const team2Score = gameState.scores[1];
if (team1Score > team2Score) {
    console.log(`Team 1 wins the round with ${team1Score} points!`);
} else if (team2Score > team1Score) {
    console.log(`Team 2 wins the round with ${team2Score} points!`);
} else {
    console.log("It's a tie!");
}
