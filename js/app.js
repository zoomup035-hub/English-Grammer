/**
 * Main Application Entry Point
 * Integrates all modules and initializes the application
 * @module app
 */

(function() {
    'use strict';

    // ============================================
    // APP CONFIGURATION
    // ============================================
    const APP_CONFIG = {
        version: '2.0.0',
        name: 'English Grammar Master',
        debug: false
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    
    /**
     * Initialize application when DOM is ready
     */
    function initApp() {
        console.log(`[App] ${APP_CONFIG.name} v${APP_CONFIG.version} starting...`);
        
        try {
            // Initialize core modules
            StorageModule.init && StorageModule.init();
            ThemeModule.init();
            GamificationModule.init();
            QuizModule.init();
            FlashcardModule.init();
                
            // Initialize UX enhancements
            if (typeof UXEnhancementModule !== 'undefined') {
                UXEnhancementModule.init();
            }
                
            // Setup event listeners
            setupEventListeners();
                
            // Register service worker
            registerServiceWorker();
                
            // Hide splash screen
            hideSplashScreen();
                
            // Update streak
            GamificationModule.updateStreak();
                
            console.log('[App] Initialization complete');
        } catch (error) {
            console.error('[App] Initialization failed:', error);
            showError('Failed to initialize application. Please refresh.');
        }
    }

    /**
     * Setup global event listeners
     */
    function setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                ThemeModule.toggleTheme();
            });
        }

        // Font size controls
        const fontIncrease = document.getElementById('fontIncrease');
        const fontDecrease = document.getElementById('fontDecrease');
        
        if (fontIncrease) {
            fontIncrease.addEventListener('click', () => {
                ThemeModule.increaseFontSize(2);
            });
        }
        
        if (fontDecrease) {
            fontDecrease.addEventListener('click', () => {
                ThemeModule.decreaseFontSize(2);
            });
        }

        // Language buttons
        const langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                ThemeModule.setLanguage(lang);
            });
        });

        // Reading progress
        window.addEventListener('scroll', UIModule.throttle(() => {
            UIModule.updateReadingProgress();
        }, 100));

        // Badge check events
        window.addEventListener('badge-check', (e) => {
            GamificationModule.checkBadge(e.detail.badge);
        });

        // Quiz complete events
        window.addEventListener('quiz-complete', (e) => {
            const results = e.detail;
            GamificationModule.addXP(results.xpEarned);
            
            // Check for perfect score badge
            if (results.accuracy === 100) {
                GamificationModule.checkBadge('perfect_score');
            }
            
            // Check for speed demon badge (< 2 minutes)
            if (results.timeTaken < 120000) {
                GamificationModule.checkBadge('speed_demon');
            }
        });

        // Card review events
        window.addEventListener('card-reviewed', (e) => {
            GamificationModule.addXP(e.detail.xpEarned);
            
            // Check flashcard master badge
            const stats = FlashcardModule.getStats();
            if (stats.total >= 50) {
                GamificationModule.checkBadge('flashcard_master');
            }
        });

        // Confetti trigger
        window.addEventListener('confetti-trigger', showConfetti);

        // Keyboard shortcuts
        setupKeyboardShortcuts();

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                UIModule.smoothScrollTo('header', 80);
            });
        }

        // Modal triggers
        document.querySelectorAll('[onclick*="openModal"]').forEach(el => {
            el.addEventListener('click', (e) => {
                const modalId = e.currentTarget.getAttribute('onclick').match(/'([^']+)'/)[1];
                UIModule.showModal(modalId);
            });
        });

        // Close modals
        document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
            el.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    UIModule.hideModal(modal.id);
                }
            });
        });
    }

    /**
     * Setup keyboard shortcuts
     */
    function setupKeyboardShortcuts() {
        // Ctrl/Cmd + K for search
        UIModule.addKeyboardShortcut('Ctrl+K', () => {
            const searchInput = document.getElementById('globalSearch');
            if (searchInput) searchInput.focus();
        });

        // Escape to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    UIModule.hideModal(modal.id);
                });
            }
        });
    }

    /**
     * Register service worker
     */
    async function registerServiceWorker() {
        // Service Workers only work on HTTP/HTTPS or localhost
        if (!('serviceWorker' in navigator)) {
            console.warn('[App] Service Worker not supported');
            return;
        }

        // Check if running from file:// protocol
        if (window.location.protocol === 'file:') {
            console.warn('[App] Service Worker requires HTTP/HTTPS protocol. Use a local server instead.');
            console.info('[App] Run: npx serve . or python3 -m http.server 8000');
            showFileProtocolWarning();
            return;
        }

        try {
            const registration = await navigator.serviceWorker.register('./sw.js');
            console.log('[App] Service Worker registered:', registration.scope);

            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateNotification();
                    }
                });
            });
        } catch (error) {
            console.error('[App] Service Worker registration failed:', error);
        }
    }

    /**
     * Show warning when running from file protocol
     * @private
     */
    function showFileProtocolWarning() {
        UIModule.showToast(
            '⚠️ For full PWA features, use a local server. Run: npx serve .',
            'warning',
            5000
        );
    }

    /**
     * Show update notification
     */
    function showUpdateNotification() {
        UIModule.showToast('New version available! Refresh to update.', 'info', 5000);
    }

    /**
     * Hide splash screen with animation
     */
    function hideSplashScreen() {
        const splash = document.getElementById('splashScreen');
        if (!splash) return;

        setTimeout(() => {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
            }, 500);
        }, 1000);
    }

    /**
     * Show confetti animation
     */
    function showConfetti() {
        const colors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
        const confettiCount = 80;

        for (let i = 0; i < confettiCount; i++) {
            createConfettiPiece(colors);
        }
    }

    /**
     * Create individual confetti piece
     * @param {Array} colors - Color array
     * @private
     */
    function createConfettiPiece(colors) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';

        document.body.appendChild(confetti);

        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        animation.onfinish = () => confetti.remove();
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    function showError(message) {
        UIModule.showToast(message, 'error', 5000);
    }

    // ============================================
    // START APPLICATION
    // ============================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }

    // Expose modules globally for backward compatibility
    window.AppModules = {
        Storage: StorageModule,
        Theme: ThemeModule,
        Quiz: QuizModule,
        Flashcards: FlashcardModule,
        Gamification: GamificationModule,
        UI: UIModule,
        Security: SecurityModule,
        Performance: PerformanceModule,
        Advanced: AdvancedModule
    };

})();
