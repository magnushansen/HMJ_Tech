// gameUtils.js

function shuffleDeck() {
    const suits = ['SPADES', 'HEARTS', 'DIAMONDS', 'CLUBS'];
    const values = ['7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE'];
    const deck = [];

    for (const suit of suits) {
        for (const value of values) {
            deck.push(value + ' ' + suit); // Format: "9 SPADES"
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
        for (let j = 0; j < 4; j++) {
            hands[j].push(deck.pop());
        }
    }
    return hands;
}

function getCardSuit(card) {
    return card.split(' ')[1]; // Extract suit (e.g., "SPADES")
}

function getCardValue(card) {
    const value = card.split(' ')[0];
    const cardPoints = { 'ACE': 11, 'KING': 4, 'QUEEN': 3, 'JACK': 2, '10': 10, '9': 0, '8': 0, '7': 0 };
    return cardPoints[value] || 0;
}

function getCardRank(card) {
    const value = card.split(' ')[0];
    const cardRankings = { 'ACE': 8, 'KING': 7, 'QUEEN': 6, 'JACK': 5, '10': 4, '9': 3, '8': 2, '7': 1 };
    return cardRankings[value];
}

function playerHasSuit(hand, suit) {
    return hand.some(card => getCardSuit(card) === suit);
}

const permanentTrumpHierarchy = ['QUEEN CLUBS', 'QUEEN SPADES', 'JACK CLUBS', 'JACK SPADES', 'JACK HEARTS', 'JACK DIAMONDS'];

function chooseTrump(hands) {
    const suits = ['SPADES', 'HEARTS', 'DIAMONDS', 'CLUBS'];
    const trumpCandidates = [];

    // Initialize count for each suit in the hand
    hands.forEach((hand, playerIndex) => {
        const suitCounts = { 'SPADES': 0, 'HEARTS': 0, 'DIAMONDS': 0, 'CLUBS': 0 };

        // Increment count for each suit in the hand
        hand.forEach(card => {
            const suit = getCardSuit(card);
            suitCounts[suit]++;
        });

        let longestSuit = null;
        let maxCount = 0;

        // Find the highest suit count
        for (const suit of suits) {
            if (suitCounts[suit] > maxCount) {
                longestSuit = suit;
                maxCount = suitCounts[suit];
            }
        }

        // Include permanent trump cards that aren't of the longest suit
        hand.forEach(card => {
            if (permanentTrumpHierarchy.includes(card) && getCardSuit(card) !== longestSuit) {
                suitCounts[longestSuit]++;
            }
        });

        // Update the maxCount after including permanent trump cards
        maxCount = suitCounts[longestSuit];

        trumpCandidates.push({ playerIndex, suit: longestSuit, count: maxCount });
    });

    // Sort trump candidates by count and prioritize clubs in case of a tie
    trumpCandidates.sort((a, b) => {
        if (b.count === a.count) {
            if (a.suit === 'CLUBS') return -1;
            if (b.suit === 'CLUBS') return 1;
        }
        return b.count - a.count;
    });

    if (trumpCandidates[0].count < 5) {
        console.log("No player has a trump holding of five or more cards. Re-dealing...");
        return null;
    }

    const chosenTrump = trumpCandidates[0].suit;
    console.log(`Player ${trumpCandidates[0].playerIndex + 1} announces the trump suit as ${chosenTrump}`);
    return { trumpSuit: chosenTrump, trumpPlayer: trumpCandidates[0].playerIndex };
}

function determineTrickWinner(trick, trumpSuit) {
    const permanentTrumpHierarchy = ['Q CLUBS', 'Q SPADES', 'J CLUBS', 'J SPADES', 'J HEARTS', 'J DIAMONDS'];

    // Is the card a trump suit
    function isPermanentTrump(card) {
        return permanentTrumpHierarchy.includes(card);
    }

    console.log("\n--- Determining Trick Winner ---");
    console.log("Trump Suit:", trumpSuit);
    console.log("Trick Played:");
    trick.forEach(play => console.log(`Player ${play.player + 1} plays ${play.card}`));

    // Check if permanent trump cards were played
    const permanentTrumpsPlayed = trick.filter(play => isPermanentTrump(play.card));
    if (permanentTrumpsPlayed.length > 0) {
        // Sort permanent trumps based on the permanent trump hierarchy listed before
        permanentTrumpsPlayed.sort((a, b) => {
            return permanentTrumpHierarchy.indexOf(a.card) - permanentTrumpHierarchy.indexOf(b.card);
        });
        const highestPermanentTrump = permanentTrumpsPlayed[0];
        console.log("Highest Permanent Trump Played:", highestPermanentTrump.card, "by Player", highestPermanentTrump.player + 1);
        return highestPermanentTrump.player;
    }

    // Check if trump cards were played
    const trumpCardsPlayed = trick.filter(play => getCardSuit(play.card) === trumpSuit);
    if (trumpCardsPlayed.length > 0) {

        // Sort trump cards based on their rank
        trumpCardsPlayed.sort((a, b) => getCardRank(b.card) - getCardRank(a.card));
        const highestTrumpCard = trumpCardsPlayed[0];
        console.log("Highest Trump Card Played:", highestTrumpCard.card, "by Player", highestTrumpCard.player + 1);
        return highestTrumpCard.player;
    }

    const leadingSuit = getCardSuit(trick[0].card);
    let winningCard = trick[0].card;
    let winningPlayer = trick[0].player;

    for (const play of trick) {
        const { player, card } = play;
        const cardSuit = getCardSuit(card);

        // If the card is trump suit and higher rank than the current winning card
        // then update the winning card and player
        if (cardSuit === leadingSuit && getCardRank(card) > getCardRank(winningCard)) {
            winningCard = card;
            winningPlayer = player;
        }
    }

    console.log("Trick Winner: Player", winningPlayer + 1, "with Card:", winningCard);
    return winningPlayer;
}

function calculateTrickPoints(trick) {
    const cardPoints = { 'ACE': 11, '10': 10, 'KING': 4, 'QUEEN': 3, 'JACK': 2, '9': 0, '8': 0, '7': 0 };

    return trick.reduce((total, play) => {
        const cardValue = play.card.split(' ')[0];
        return total + (cardPoints[cardValue] || 0);
    }, 0);
}

export {
    shuffleDeck,
    dealCards,
    getCardSuit,
    getCardValue,
    getCardRank,
    chooseTrump,
    determineTrickWinner,
    calculateTrickPoints,
    playerHasSuit
};
