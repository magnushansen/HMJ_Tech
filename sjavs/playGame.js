import {
    shuffleDeck,
    dealCards,
    getCardSuit,
    getCardValue,
    playerHasSuit,
    determineTrickWinner,
    calculateTrickPoints,
    chooseTrump
} from './lib/gameUtils.js';

import { updateScoreSheet, calculateFinalScore, resetDoubleNextGameScore } from './lib/scoring.js';
import { printScoreSheet } from './lib/scoreSheet.js';
import promptSync from 'prompt-sync';

const prompt = promptSync();

function playTrick(hands, gameState, startingPlayerIndex) {
    gameState.currentTrick = [];
    gameState.leadingSuit = null;

    for (let i = 0; i < 4; i++) {
        const playerIndex = (startingPlayerIndex + i) % 4;
        const playerHand = hands[playerIndex];

        console.log(`Player ${playerIndex + 1}'s turn.`);
        console.log(`Your hand: ${playerHand.join(', ')}`);

        let card;
        let validCard = false;

        // Loop until the player enters a valid card
        while (!validCard) {
            card = prompt(`Player ${playerIndex + 1}, choose a card to play (or type 'EXIT' to quit): `).toUpperCase();
            if (card === 'EXIT') {
                console.log("Exiting the game...");
                process.exit(0);
            }

            if (playerHand.includes(card)) {
                const cardSuit = getCardSuit(card);

                // Rule: If leading suit exists, player must follow it
                if (
                    !gameState.leadingSuit || // No leading suit yet
                    cardSuit === gameState.leadingSuit || // Matches leading suit
                    !playerHasSuit(playerHand, gameState.leadingSuit) // Player does not have leading suit
                ) {
                    // Rule: If player has no leading suit but has trump cards, they must play trump cards
                    if (
                        cardSuit !== gameState.trumpSuit && // Not playing trump suit
                        !playerHasSuit(playerHand, gameState.leadingSuit) && // No leading suit
                        playerHasSuit(playerHand, gameState.trumpSuit) // Has trump suit
                    ) {
                        console.log(
                            `You must play a trump suit (${gameState.trumpSuit}) card if you don't have the leading suit.`
                        );
                    } else {
                        validCard = true; // Card is valid
                    }
                } else {
                    console.log(
                        `You must play a card of the leading suit (${gameState.leadingSuit}) if you have one.`
                    );
                }
            } else {
                console.log("Invalid card. Please choose a card from your hand.");
            }
        }

        // Remove the card from the player's hand and add it to the trick
        playerHand.splice(playerHand.indexOf(card), 1);
        gameState.currentTrick.push({ player: playerIndex, card });

        // Set the leading suit if this is the first card played
        if (!gameState.leadingSuit) {
            gameState.leadingSuit = getCardSuit(card);
        }
    }

    // Determine trick winner
    const trickWinner = determineTrickWinner(gameState.currentTrick, gameState.trumpSuit);
    console.log(`Player ${trickWinner + 1} wins the trick!`);

    // Calculate points for the trick
    const trickPoints = calculateTrickPoints(gameState.currentTrick);
    const team = trickWinner % 2 === 0 ? 0 : 1;
    gameState.scores[team] += trickPoints;

    // Debugging: Show all cards played in the trick
    console.log("Cards played in this trick:");
    gameState.currentTrick.forEach((play) => {
        console.log(`Player ${play.player + 1}: ${play.card}`);
    });

    console.log(`Points for this trick: ${trickPoints}`);
    console.log(`Current Score - Team 1: ${gameState.scores[0]}, Team 2: ${gameState.scores[1]}\n`);

    return trickWinner;
}

// Main Game Loop
let gameEnded = false;
while (!gameEnded) {
    console.log("\nStarting a new round...\n");

    let hands, trumpSuit;
    do {
        const deck = shuffleDeck();
        hands = dealCards(deck);
        trumpSuit = chooseTrump(hands);
    } while (!trumpSuit);

    console.log(`Trump suit chosen: ${trumpSuit.trumpSuit}`);

    // Initialize game state
    const gameState = { 
        currentTrick: [], 
        leadingSuit: null, 
        trumpSuit: trumpSuit.trumpSuit, // Ensure trump suit is fixed throughout the game
        scores: [0, 0] 
    };
    let currentLeader = 0;

    // Play all 8 tricks in the round
    for (let i = 0; i < 8; i++) {
        console.log(`--- Trick ${i + 1} ---`);
        currentLeader = playTrick(hands, gameState, currentLeader);
    }

    // Calculate final scores
    const team1Score = gameState.scores[0];
    const team2Score = gameState.scores[1];
    const [team1FinalScore, team2FinalScore] = calculateFinalScore(team1Score, team2Score, trumpSuit.trumpSuit);

    if (team1FinalScore > team2FinalScore) {
        resetDoubleNextGameScore();
        gameEnded = updateScoreSheet("We", team1FinalScore);
    } else if (team2FinalScore > team1FinalScore) {
        resetDoubleNextGameScore();
        gameEnded = updateScoreSheet("They", team2FinalScore);
    }

    // Print score sheet
    printScoreSheet();
}

console.log("Game over!");
