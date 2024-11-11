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

        // Add the player as a trump candidate based on their longest suit
        trumpCandidates.push({ playerIndex, suit: longestSuit, count: maxCount });
    });

    // Sort candidates by suit count, prioritizing the player with the most cards in a suit
    trumpCandidates.sort((a, b) => b.count - a.count);

    if (trumpCandidates[0].count < 5) {
        console.log("No player has a trump holding of five or more cards. Re-dealing...");
        return null; // Signal to re-deal
    }

    // Choose the suit of the top candidate as the trump suit
    const chosenTrump = trumpCandidates[0].suit === '♣' || trumpCandidates[0].count > trumpCandidates[1]?.count
        ? trumpCandidates[0].suit
        : '♣';

    console.log(`Player ${trumpCandidates[0].playerIndex + 1} announces the trump suit as ${chosenTrump}`);
    return { trumpSuit: chosenTrump, trumpPlayer: trumpCandidates[0].playerIndex };
}

function determineTrickWinner(trick, trumpSuit) {
    // Define the permanent trump hierarchy in the correct order
    const permanentTrumpHierarchy = ['Q♣', 'Q♠', 'J♣', 'J♠', 'J♥', 'J♦'];

    // Helper function to check if a card is a permanent trump
    function isPermanentTrump(card) {
        const isTrump = permanentTrumpHierarchy.includes(card);
        console.log(`Checking if ${card} is a permanent trump: ${isTrump}`);
        return isTrump;
    }

    console.log("\n--- Determining Trick Winner ---");
    console.log("Trump Suit:", trumpSuit);
    console.log("Trick Played:");
    trick.forEach(play => console.log(`Player ${play.player + 1} plays ${play.card}`));

    // Step 1: Identify any permanent trump cards played in this trick
    const permanentTrumpsPlayed = trick.filter(play => isPermanentTrump(play.card));
    console.log("Permanent Trumps Played:", permanentTrumpsPlayed.map(play => play.card));

    if (permanentTrumpsPlayed.length > 0) {
        // Sort permanent trumps based on the permanent trump hierarchy
        permanentTrumpsPlayed.sort((a, b) => permanentTrumpHierarchy.indexOf(a.card) - permanentTrumpHierarchy.indexOf(b.card));
        const highestPermanentTrump = permanentTrumpsPlayed[0];
        console.log("Highest Permanent Trump Played:", highestPermanentTrump.card, "by Player", highestPermanentTrump.player + 1);
        return highestPermanentTrump.player;
    }

    // Step 2: No permanent trumps were played, so follow trump suit and leading suit rules
    let winningCard = trick[0].card;
    let winningPlayer = trick[0].player;
    console.log("Initial Winning Card:", winningCard, "by Player", winningPlayer + 1);

    for (const play of trick) {
        const { player, card } = play;
        const cardSuit = getCardSuit(card);

        if (cardSuit === trumpSuit) {
            // If the current card is a trump card, it wins over non-trump cards
            if (getCardSuit(winningCard) !== trumpSuit || getCardValue(card) > getCardValue(winningCard)) {
                winningCard = card;
                winningPlayer = player;
                console.log("New Winning Trump Card:", winningCard, "by Player", winningPlayer + 1);
            }
        } else if (cardSuit === getCardSuit(winningCard) && getCardValue(card) > getCardValue(winningCard)) {
            // If the card matches the leading suit, compare its value to the current winning card
            winningCard = card;
            winningPlayer = player;
            console.log("New Winning Leading Suit Card:", winningCard, "by Player", winningPlayer + 1);
        }
    }

    console.log("Trick Winner: Player", winningPlayer + 1, "with Card:", winningCard);
    return winningPlayer;
}




function calculateTrickPoints(trick) {
    const cardPoints = { 'A': 11, '10': 10, '9': 9, '8' : 8, '7' : 7, 'K': 4, 'Q': 3, 'J': 2 };
    return trick.reduce((total, play) => {
        // Get the value of the card (e.g., 'A', '10', etc.)
        const cardValue = play.card.slice(0, -1);
        // Add the points for the card to the total
        return total + (cardPoints[cardValue] || 0);
    }, 0);
}


module.exports = {
    shuffleDeck,
    dealCards,
    getCardSuit,
    getCardValue,
    chooseTrump,
    determineTrickWinner,
    calculateTrickPoints,
    playerHasSuit
};

