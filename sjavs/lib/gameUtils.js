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
    const cardPoints = { 'A': 11, '10': 10, 'K': 4, 'Q': 3, 'J': 2 };
    return cardPoints[value] || 0;
}

function playerHasSuit(hand, suit) {
    return hand.some(card => getCardSuit(card) === suit);
}



function chooseTrump(hands) {
    // Calculate the count of each suit in each player's hand
    const suits = ['♠', '♥', '♦', '♣'];
    const trumpCandidates = [];

    hands.forEach((hand, playerIndex) => {
        const suitCounts = { '♠': 0, '♥': 0, '♦': 0, '♣': 0 };

        // Count the number of cards in each suit
        hand.forEach(card => {
            const suit = getCardSuit(card);
            if (suits.includes(suit)) {
                suitCounts[suit]++;
            }
        });

        // Find the longest suit in the player's hand
        let longestSuit = null;
        let maxCount = 0;

        for (const suit of suits) {
            if (suitCounts[suit] > maxCount) {
                longestSuit = suit;
                maxCount = suitCounts[suit];
            }
        }

        // If the player has 5 or more cards in the longest suit, they become a trump candidate
        if (maxCount >= 5) {
            trumpCandidates.push({ playerIndex, suit: longestSuit, count: maxCount });
        }
    });

    // If there are no trump candidates, return null indicating a redeal is needed
    if (trumpCandidates.length === 0) return null;

    // Sort candidates by count of suit (descending), then by suit priority (♣ > ♦ > ♥ > ♠)
    trumpCandidates.sort((a, b) => {
        if (a.count !== b.count) {
            return b.count - a.count; // Higher count comes first
        }
        return suits.indexOf(b.suit) - suits.indexOf(a.suit); // Prioritize suits in ♣ > ♦ > ♥ > ♠ order
    });

    // The first candidate in the sorted array is the one with the longest suit or highest priority
    const trumpSuit = trumpCandidates[0].suit;
    const trumpPlayer = trumpCandidates[0].playerIndex;

    return { trumpSuit, trumpPlayer }; // Return the selected trump suit and the player who chose it
}

function playCard(player, card, gameState) {
    if (gameState.currentTrick.length === 0) {
        gameState.leadingSuit = getCardSuit(card);
    }
    if (getCardSuit(card) !== gameState.leadingSuit && !playerHasSuit(player.hand, gameState.leadingSuit)) {
        throw new Error("Must follow suit if possible");
    }
    gameState.currentTrick.push({ player, card });
}

function determineTrickWinner(trick, trumpSuit) {
    let winningCard = trick[0].card;
    let winningPlayer = trick[0].player;

    for (const play of trick) {
        const { player, card } = play;
        if (getCardSuit(card) === trumpSuit && getCardSuit(winningCard) !== trumpSuit) {
            winningCard = card;
            winningPlayer = player;
        } else if (getCardSuit(card) === getCardSuit(winningCard) && getCardValue(card) > getCardValue(winningCard)) {
            winningCard = card;
            winningPlayer = player;
        }
    }
    return winningPlayer;
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
