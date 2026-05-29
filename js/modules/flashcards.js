/**
 * Flashcard Module - Handles flashcard decks and spaced repetition
 * @module flashcards
 */

const FlashcardModule = (function() {
    'use strict';

    // Private state
    let currentDeck = 'all';
    let currentCardIndex = 0;
    let cardHistory = {}; // Track card performance for spaced repetition

    /**
     * Initialize flashcard module
     */
    function init() {
        currentDeck = StorageModule.getItem('flashcard-deck', 'all');
        cardHistory = StorageModule.getItem('card-history', {});
        console.log('[Flashcards] Initialized');
    }

    /**
     * Load a specific deck
     * @param {string} deckName - Name of the deck
     * @returns {Array} Cards in the deck
     */
    function loadDeck(deckName) {
        currentDeck = deckName;
        currentCardIndex = 0;
        StorageModule.setItem('flashcard-deck', deckName);
        
        const decks = window.FlashcardDecks || {};
        return decks[deckName]?.cards || [];
    }

    /**
     * Get current card
     * @param {Array} cards - Array of cards
     * @returns {Object|null} Current card or null
     */
    function getCurrentCard(cards) {
        if (!cards || cards.length === 0) return null;
        return cards[currentCardIndex % cards.length];
    }

    /**
     * Move to next card
     * @param {Array} cards - Array of cards
     * @returns {Object|null} Next card or null
     */
    function nextCard(cards) {
        if (!cards || cards.length === 0) return null;
        
        currentCardIndex = (currentCardIndex + 1) % cards.length;
        return getCurrentCard(cards);
    }

    /**
     * Move to previous card
     * @param {Array} cards - Array of cards
     * @returns {Object|null} Previous card or null
     */
    function previousCard(cards) {
        if (!cards || cards.length === 0) return null;
        
        currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
        return getCurrentCard(cards);
    }

    /**
     * Rate card difficulty (for spaced repetition)
     * @param {string} cardFront - Front text of the card
     * @param {number} rating - Difficulty rating (1-5, 1=hard, 5=easy)
     */
    function rateCard(cardFront, rating) {
        if (!cardHistory[cardFront]) {
            cardHistory[cardFront] = {
                reviews: 0,
                successRate: 0,
                lastReviewed: null,
                interval: 1
            };
        }
        
        const card = cardHistory[cardFront];
        card.reviews++;
        card.lastReviewed = Date.now();
        
        // Update success rate
        const totalRating = (card.successRate * (card.reviews - 1)) + rating;
        card.successRate = totalRating / card.reviews;
        
        // Calculate next review interval (simplified SM-2 algorithm)
        if (rating >= 4) {
            card.interval = Math.min(card.interval * 2, 30); // Max 30 days
        } else if (rating <= 2) {
            card.interval = 1; // Review tomorrow
        }
        
        StorageModule.setItem('card-history', cardHistory);
        
        // Award XP for studying
        window.dispatchEvent(new CustomEvent('card-reviewed', { 
            detail: { rating, xpEarned: 5 } 
        }));
    }

    /**
     * Get cards due for review based on spaced repetition
     * @param {Array} allCards - All cards in deck
     * @returns {Array} Cards due for review
     */
    function getDueCards(allCards) {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        
        return allCards.filter(card => {
            const history = cardHistory[card.front];
            if (!history) return true; // New cards are always due
            
            const lastReview = history.lastReviewed || 0;
            const daysSinceReview = (now - lastReview) / oneDay;
            
            return daysSinceReview >= history.interval;
        });
    }

    /**
     * Shuffle cards array
     * @param {Array} cards - Cards to shuffle
     * @returns {Array} Shuffled cards
     */
    function shuffleCards(cards) {
        const shuffled = [...cards];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Get deck statistics
     * @returns {Object} Deck statistics
     */
    function getStats() {
        const totalCards = Object.keys(cardHistory).length;
        const masteredCards = Object.values(cardHistory).filter(c => c.successRate >= 4).length;
        const learningCards = Object.values(cardHistory).filter(c => c.successRate < 4 && c.successRate >= 2).length;
        const newCards = totalCards - masteredCards - learningCards;
        
        return {
            total: totalCards,
            mastered: masteredCards,
            learning: learningCards,
            new: newCards
        };
    }

    /**
     * Reset card history
     */
    function resetHistory() {
        cardHistory = {};
        StorageModule.removeItem('card-history');
    }

    /**
     * Get current deck name
     * @returns {string} Current deck name
     */
    function getCurrentDeck() {
        return currentDeck;
    }

    /**
     * Get current card index
     * @returns {number} Current card index
     */
    function getCurrentIndex() {
        return currentCardIndex;
    }

    // Public API
    return {
        init,
        loadDeck,
        getCurrentCard,
        nextCard,
        previousCard,
        rateCard,
        getDueCards,
        shuffleCards,
        getStats,
        resetHistory,
        getCurrentDeck,
        getCurrentIndex
    };
})();

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlashcardModule;
}
