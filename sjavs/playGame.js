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
let deck, hands, trumpSuit;

function chooseTrump(hands) {
    let potentialTrumps = [];

    hands.forEach((hand, index) => {
        const suitCounts = { '♠': 0, '♥': 0, '♦': 0, '♣': 0 };

        // Count the number of each suit in the player's hand
        hand.forEach(card => {
            const suit = getCardSuit(card);
            suitCounts[suit]++;
        });

        // Find the longest suit for this player
        const maxSuitLength = Math.max(...Object.values(suitCounts));
        const longestSuits = Object.keys(suitCounts).filter(suit => suitCounts[suit] === maxSuitLength);

        potentialTrumps.push({
            player: index,
            longestSuits,
            maxSuitLength
        });
    });

    // Find the player with the longest suit across all players
    const maxTrumpLength = Math.max(...potentialTrumps.map(p => p.maxSuitLength));
    const trumpCandidates = potentialTrumps.filter(p => p.maxSuitLength === maxTrumpLength);

    if (maxTrumpLength < 5) {
        // If no one has a suit of 5 or more cards, trigger a re-deal
        console.log("No player has a trump holding of five or more cards. Re-dealing...");
        return null; // Signal to re-deal
    }

    // If multiple players have the longest suit length, choose the first player in the list
    const trumpPlayer = trumpCandidates[0];
    const trumpSuit = trumpPlayer.longestSuits.includes('♣') ? '♣' : trumpPlayer.longestSuits[0];
    console.log(`Player ${trumpPlayer.player + 1} announces the trump suit as ${trumpSuit}`);
    
    return trumpSuit;
}

// Repeat dealing until a valid trump suit is chosen
do {
    deck = shuffleDeck();
    hands = dealCards(deck);

    // Determine the trump suit based on the longest suit rule
    trumpSuit = chooseTrump(hands);

} while (!trumpSuit);

console.log(`The trump suit for this round is ${trumpSuit}.`);

// Define game state
const gameState = {
    currentTrick: [],
    leadingSuit: null,
    scores: [0, 0], // Team 1 (Players 1 & 3) and Team 2 (Players 2 & 4)
    trumpSuit // Assign trumpSuit to the game state
};

// Display each player's hand
hands.forEach((hand, index) => {
    console.log(`Player ${index + 1} hand: ${hand.join(', ')}`);
});

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

// Calculate final scores based on the game rules
const [team1FinalScore, team2FinalScore] = calculateFinalScore(team1Score, team2Score, trumpSuit);

// Display the final result based on calculated scores
if (team1FinalScore > team2FinalScore) {
    console.log(`Team 1 wins the round with ${team1FinalScore} points!`);
} else if (team2FinalScore > team1FinalScore) {
    console.log(`Team 2 wins the round with ${team2FinalScore} points!`);
} else {
    console.log("It's a tie!");
}
