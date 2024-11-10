// lib/gameUtils.js
function shuffleDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];

    for (const suit of suits) {
        for (const value of values) {
            deck.push(value + suit);
        }
    }

    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}



function dealCards(deck) {
    const hands = [[], [], [], []];
    for (let i = 0; i < 8; i++) {
        hands.forEach(hand => hand.push(deck.pop()));
    }
    return hands;
}


function getCardSuit(card) {
    return card.slice(-1); // Returns the last character, e.g., '♠'
}

function getCardValue(card) {
    const value = card.slice(0, -1);
    const cardPoints = { 'A': 11, 'K': 4, 'Q': 3, 'J': 2, '10': 10 };
    return cardPoints[value] || 0;
}

function playerHasSuit(hand, suit) {
    return hand.some(card => getCardSuit(card) === suit);
}


function chooseTrump(hands) {
    const suits = ['♠', '♥', '♦', '♣'];
    const trumpCandidates = [];

    hands.forEach((hand, playerIndex) => {
        const suitCounts = { '♠': 0, '♥': 0, '♦': 0, '♣': 0 };

        // Count the number of cards in each suit for the player
        hand.forEach(card => {
            const suit = getCardSuit(card);
            suitCounts[suit]++;
        });

        // Determine the longest suit in the player's hand
        let longestSuit = null;
        let maxCount = 0;

        for (const suit of suits) {
            if (suitCounts[suit] > maxCount) {
                longestSuit = suit;
                maxCount = suitCounts[suit];
            }
        }

        // If the player has 5 or more cards in the longest suit, they are a trump candidate
        if (maxCount >= 5) {
            trumpCandidates.push({ playerIndex, suit: longestSuit, count: maxCount });
        }
    });

    console.log("Trump Candidates:", trumpCandidates);

    // If no player has a strong suit, randomly select a trump suit
    if (trumpCandidates.length === 0) {
        const randomSuit = suits[Math.floor(Math.random() * suits.length)];
        console.log("No strong suit found, choosing random trump:", randomSuit);
        return { trumpSuit: randomSuit, trumpPlayer: null }; // Return random suit as trump
    }

    // Sort candidates by suit count, prioritizing the player with the most cards in a suit
    trumpCandidates.sort((a, b) => b.count - a.count);

    // Choose the suit of the top candidate as the trump suit
    const chosenTrump = trumpCandidates[0].suit;
    const trumpPlayer = trumpCandidates[0].playerIndex;
    console.log("Chosen Trump Suit:", chosenTrump);
    return { trumpSuit: chosenTrump, trumpPlayer };
}

function determineTrumpSuit(hands) {
    let potentialTrumps = []; // To store each player's longest suit info

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




function playCard(player, card, gameState) {
    if (gameState.currentTrick.length === 0) {
        gameState.leadingSuit = getCardSuit(card);
    }

    const cardSuit = getCardSuit(card);
    
    // Enforce following suit if possible
    if (cardSuit !== gameState.leadingSuit && playerHasSuit(player.hand, gameState.leadingSuit)) {
        throw new Error(`Player ${player} must follow suit. They have ${gameState.leadingSuit} in hand.`);
    }
    
    gameState.currentTrick.push({ player, card });
}


function determineTrickWinner(trick, trumpSuit) {
    // Define the trump hierarchy
    const trumpHierarchy = ['♣Q', '♠Q', '♣J', '♠J', '♥J', '♦J'];

    let winningCard = trick[0].card;
    let winningPlayer = trick[0].player;

    for (const play of trick) {
        const { player, card } = play;

        if (trumpHierarchy.includes(card)) {
            // If the card is in the trump hierarchy, check if it's stronger than the current winning card
            if (!trumpHierarchy.includes(winningCard) || trumpHierarchy.indexOf(card) < trumpHierarchy.indexOf(winningCard)) {
                winningCard = card;
                winningPlayer = player;
            }
        } else if (getCardSuit(card) === trumpSuit) {
            // Regular trump cards, check if winningCard is a trump or if the card is higher
            if (getCardSuit(winningCard) !== trumpSuit || getCardValue(card) > getCardValue(winningCard)) {
                winningCard = card;
                winningPlayer = player;
            }
        } else if (getCardSuit(card) === getCardSuit(winningCard) && getCardValue(card) > getCardValue(winningCard)) {
            // Non-trump, follow suit and check value
            winningCard = card;
            winningPlayer = player;
        }
    }
    return winningPlayer;
}

function isRedSuit(suit) {
    return suit === '♥' || suit === '♦';
}

function countTrumps(trumpSuit) {
    return isRedSuit(trumpSuit) ? 13 : 12;
}



function calculateTrickPoints(trick) {
    const cardPoints = { 'A': 11, '10': 10, 'K': 4, 'Q': 3, 'J': 2 };
    return trick.reduce((total, play) => total + (cardPoints[play.card[0]] || 0), 0);
}


module.exports = {
    shuffleDeck,
    dealCards,
    getCardSuit,
    getCardValue,
    chooseTrump,
    playCard,
    determineTrickWinner,
    calculateTrickPoints,
    playerHasSuit
};
