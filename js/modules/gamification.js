/**
 * Gamification Module - Handles XP, levels, badges, and streaks
 * @module gamification
 */

const GamificationModule = (function() {
    'use strict';

    // Constants
    const LEVELS = [
        "Beginner", "Learner", "Intermediate", "Expert", 
        "Grammar Master", "Legend", "Grandmaster"
    ];
    
    const LEVEL_XP_STEP = 500;
    
    const BADGES = {
        first_quiz: { name: "First Quiz", icon: "🎯", description: "Complete your first quiz" },
        perfect_score: { name: "Perfect Score", icon: "💯", description: "Get 100% on a quiz" },
        streak_3: { name: "3-Day Streak", icon: "🔥", description: "Study for 3 consecutive days" },
        streak_7: { name: "Week Warrior", icon: "⚡", description: "Study for 7 consecutive days" },
        night_owl: { name: "Night Owl", icon: "🦉", description: "Use dark mode 5 times" },
        scholar: { name: "Scholar", icon: "📚", description: "Earn 1000 XP" },
        flashcard_master: { name: "Flashcard Master", icon: "🃏", description: "Review 50 flashcards" },
        speed_demon: { name: "Speed Demon", icon: "⚡", description: "Complete quiz in under 2 minutes" }
    };

    // Private state
    let xp = 0;
    let level = 0;
    let badges = [];
    let streak = 0;
    let lastStudyDate = null;

    /**
     * Initialize gamification module
     */
    function init() {
        xp = StorageModule.getItem('xp', 0);
        badges = StorageModule.getItem('badges', []);
        streak = StorageModule.getItem('streak', 0);
        lastStudyDate = StorageModule.getItem('lastStudyDate', null);
        
        level = calculateLevel(xp);
        updateDisplay();
        
        console.log('[Gamification] Initialized:', { xp, level, streak, badges: badges.length });
    }

    /**
     * Add XP and check for level up
     * @param {number} amount - XP amount to add
     * @returns {Object} Result with new XP and level info
     */
    function addXP(amount) {
        const oldLevel = level;
        xp += amount;
        level = calculateLevel(xp);
        
        StorageModule.setItem('xp', xp);
        
        const result = {
            xp: xp,
            level: level,
            leveledUp: level > oldLevel,
            oldLevel: oldLevel
        };
        
        if (result.leveledUp) {
            showLevelUpNotification(oldLevel, level);
        }
        
        updateDisplay();
        
        // Check for scholar badge
        if (xp >= 1000) {
            checkBadge('scholar');
        }
        
        return result;
    }

    /**
     * Calculate user level based on XP
     * @param {number} totalXP - Total XP
     * @returns {number} Level index
     */
    function calculateLevel(totalXP) {
        return Math.min(Math.floor(totalXP / LEVEL_XP_STEP), LEVELS.length - 1);
    }

    /**
     * Update study streak
     */
    function updateStreak() {
        const today = new Date().toDateString();
        
        if (lastStudyDate === today) {
            return; // Already studied today
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastStudyDate === yesterday.toDateString()) {
            streak++;
        } else if (lastStudyDate !== today) {
            streak = 1; // Reset streak
        }
        
        lastStudyDate = today;
        StorageModule.setItem('streak', streak);
        StorageModule.setItem('lastStudyDate', today);
        
        updateDisplay();
        
        // Check streak badges
        if (streak >= 3) checkBadge('streak_3');
        if (streak >= 7) checkBadge('streak_7');
    }

    /**
     * Check and award badge
     * @param {string} badgeId - Badge identifier
     * @returns {boolean} Whether badge was newly awarded
     */
    function checkBadge(badgeId) {
        if (!BADGES[badgeId]) {
            console.warn(`[Gamification] Unknown badge: ${badgeId}`);
            return false;
        }
        
        if (badges.includes(badgeId)) {
            return false; // Already has badge
        }
        
        badges.push(badgeId);
        StorageModule.setItem('badges', badges);
        
        showBadgeNotification(BADGES[badgeId]);
        updateDisplay();
        
        return true;
    }

    /**
     * Get all available badges
     * @returns {Object} All badges
     */
    function getAllBadges() {
        return BADGES;
    }

    /**
     * Get earned badges with details
     * @returns {Array} Earned badges with details
     */
    function getEarnedBadges() {
        return badges.map(id => ({
            id,
            ...BADGES[id]
        }));
    }

    /**
     * Show level up notification
     * @param {number} oldLevel - Previous level
     * @param {number} newLevel - New level
     * @private
     */
    function showLevelUpNotification(oldLevel, newLevel) {
        showToast(`🎉 Level Up! You're now ${LEVELS[newLevel]}!`, 'success');
        
        // Trigger confetti effect
        triggerConfetti();
    }

    /**
     * Show badge notification
     * @param {Object} badge - Badge object
     * @private
     */
    function showBadgeNotification(badge) {
        showToast(`🏆 Badge Unlocked: ${badge.name}`, 'achievement');
        
        // Trigger confetti effect
        triggerConfetti();
    }

    /**
     * Display toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type
     * @private
     */
    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        
        container.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Trigger confetti animation
     * @private
     */
    function triggerConfetti() {
        const confettiEvent = new CustomEvent('confetti-trigger');
        window.dispatchEvent(confettiEvent);
    }

    /**
     * Update UI display with current stats
     * @private
     */
    function updateDisplay() {
        const xpEl = document.getElementById('xpCount');
        const levelEl = document.getElementById('userLevel');
        const streakEl = document.getElementById('streakCount');
        const badgeEl = document.getElementById('badgeCount');
        
        if (xpEl) xpEl.textContent = xp;
        if (levelEl) levelEl.textContent = LEVELS[level];
        if (streakEl) streakEl.textContent = streak;
        if (badgeEl) badgeEl.textContent = badges.length;
    }

    /**
     * Get current gamification stats
     * @returns {Object} Current stats
     */
    function getStats() {
        return {
            xp,
            level: LEVELS[level],
            levelIndex: level,
            streak,
            badges: badges.length,
            nextLevelXP: (level + 1) * LEVEL_XP_STEP,
            progressToNextLevel: (xp % LEVEL_XP_STEP) / LEVEL_XP_STEP * 100
        };
    }

    /**
     * Reset all progress (for testing)
     */
    function resetProgress() {
        xp = 0;
        level = 0;
        badges = [];
        streak = 0;
        lastStudyDate = null;
        
        StorageModule.removeItem('xp');
        StorageModule.removeItem('badges');
        StorageModule.removeItem('streak');
        StorageModule.removeItem('lastStudyDate');
        
        updateDisplay();
    }

    // Public API
    return {
        init,
        addXP,
        updateStreak,
        checkBadge,
        getAllBadges,
        getEarnedBadges,
        getStats,
        resetProgress
    };
})();

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamificationModule;
}
