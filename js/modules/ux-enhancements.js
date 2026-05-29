/**
 * UI/UX Enhancement Module - Visual improvements and mobile optimizations
 * @module ux-enhancements
 */

const UXEnhancementModule = (function() {
    'use strict';

    /**
     * Initialize all UX enhancements
     */
    function init() {
        addSmoothScrolling();
        addHoverEffects();
        optimizeTouchTargets();
        addPullToRefresh();
        addSwipeGestures();
        enhanceForms();
        console.log('[UX] Enhancements initialized');
    }

    /**
     * Add smooth scrolling with offset for fixed header
     */
    function addSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const offset = 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    /**
     * Add enhanced hover effects to cards and buttons
     */
    function addHoverEffects() {
        document.querySelectorAll('.card, .tense-card, .pos-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px) scale(1.02)';
                card.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
            });
        });

        document.querySelectorAll('.button, .option-btn, .control-btn').forEach(btn => {
            btn.addEventListener('mousedown', () => {
                btn.style.transform = 'scale(0.96)';
            });
            
            btn.addEventListener('mouseup', () => {
                btn.style.transform = 'scale(1)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
            });
        });
    }

    /**
     * Optimize touch targets for mobile (minimum 44x44px)
     */
    function optimizeTouchTargets() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            document.querySelectorAll('.control-btn, .lang-btn, .nav-link').forEach(el => {
                el.style.minWidth = '44px';
                el.style.minHeight = '44px';
                el.style.padding = '12px';
            });

            document.querySelectorAll('.bottom-nav-item').forEach(item => {
                item.style.padding = '8px 12px';
            });
        }
    }

    /**
     * Add pull-to-refresh functionality for mobile
     */
    function addPullToRefresh() {
        if (!('ontouchstart' in window)) return;
        
        let startY = 0;
        let pulling = false;
        const threshold = 100;
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].pageY;
                pulling = true;
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (!pulling) return;
            
            const currentY = e.touches[0].pageY;
            const diff = currentY - startY;
            
            if (diff > threshold && window.scrollY === 0) {
                showPullIndicator();
            }
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            if (!pulling) return;
            pulling = false;
            hidePullIndicator();
        });
    }

    /**
     * Show pull-to-refresh indicator
     * @private
     */
    function showPullIndicator() {
        let indicator = document.getElementById('pull-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'pull-indicator';
            indicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
            indicator.style.cssText = `
                position: fixed;
                top: 70px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--primary);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                z-index: 9999;
                font-size: 0.9rem;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `;
            document.body.appendChild(indicator);
        }
        indicator.style.display = 'block';
    }

    /**
     * Hide pull-to-refresh indicator
     * @private
     */
    function hidePullIndicator() {
        const indicator = document.getElementById('pull-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    /**
     * Add swipe gestures for flashcards and navigation
     */
    function addSwipeGestures() {
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) < minSwipeDistance) return;
            
            const flashcard = document.querySelector('.flashcard.active');
            if (flashcard) {
                if (swipeDistance > 0) {
                    window.dispatchEvent(new CustomEvent('flashcard-prev'));
                } else {
                    window.dispatchEvent(new CustomEvent('flashcard-next'));
                }
            }
        }
    }

    /**
     * Enhance form inputs with better UX
     */
    function enhanceForms() {
        document.querySelectorAll('.search-input, input[type="text"], textarea').forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('globalSearch');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    // Public API
    return {
        init
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UXEnhancementModule;
}
