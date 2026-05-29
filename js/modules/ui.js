/**
 * UI Module - DOM manipulation, animations, and accessibility helpers
 * @module ui
 */

const UIModule = (function() {
    'use strict';

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type (info, success, error, warning)
     * @param {number} duration - Duration in milliseconds
     */
    function showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        
        // Use textContent for safety
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Auto-remove
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /**
     * Show modal dialog
     * @param {string} modalId - Modal element ID
     */
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus first focusable element
        const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) focusable.focus();
        
        // Trap focus within modal
        trapFocus(modal);
    }

    /**
     * Hide modal dialog
     * @param {string} modalId - Modal element ID
     */
    function hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }

    /**
     * Trap focus within an element (for modals)
     * @param {HTMLElement} element - Element to trap focus in
     * @private
     */
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }

    /**
     * Create loading spinner
     * @param {string} size - Size (small, medium, large)
     * @returns {HTMLElement} Spinner element
     */
    function createSpinner(size = 'medium') {
        const spinner = document.createElement('div');
        spinner.className = `spinner spinner-${size}`;
        spinner.setAttribute('role', 'progressbar');
        spinner.setAttribute('aria-label', 'Loading');
        return spinner;
    }

    /**
     * Lazy load images with Intersection Observer
     * @param {NodeList} images - Images to lazy load
     */
    function lazyLoadImages(images) {
        if (!('IntersectionObserver' in window)) {
            // Fallback: load all images immediately
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
            return;
        }
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    /**
     * Add smooth scroll behavior
     * @param {string} targetId - Target element ID to scroll to
     * @param {number} offset - Offset from top
     */
    function smoothScrollTo(targetId, offset = 0) {
        const target = document.getElementById(targetId);
        if (!target) return;
        
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Show/hide element with fade animation
     * @param {HTMLElement} element - Element to toggle
     * @param {boolean} show - Show or hide
     * @param {number} duration - Animation duration in ms
     */
    function fadeToggle(element, show, duration = 300) {
        if (!element) return;
        
        if (show) {
            element.style.display = 'block';
            element.style.opacity = '0';
            
            setTimeout(() => {
                element.style.transition = `opacity ${duration}ms ease`;
                element.style.opacity = '1';
            }, 10);
        } else {
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = '0';
            
            setTimeout(() => {
                element.style.display = 'none';
            }, duration);
        }
    }

    /**
     * Debounce function execution
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function execution
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Success status
     */
    async function copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            }
        } catch (error) {
            console.error('[UI] Failed to copy:', error);
            return false;
        }
    }

    /**
     * Vibrate device (if supported)
     * @param {number|number[]} pattern - Vibration pattern
     */
    function vibrate(pattern) {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }

    /**
     * Update reading progress bar
     */
    function updateReadingProgress() {
        const progressBar = document.getElementById('readingProgress');
        if (!progressBar) return;
        
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        progressBar.style.width = scrolled + '%';
    }

    /**
     * Add keyboard shortcut handler
     * @param {string} key - Key combination (e.g., 'Ctrl+K')
     * @param {Function} callback - Callback function
     */
    function addKeyboardShortcut(key, callback) {
        document.addEventListener('keydown', (e) => {
            const keys = key.split('+').map(k => k.trim().toLowerCase());
            
            const ctrlMatch = keys.includes('ctrl') ? e.ctrlKey : true;
            const shiftMatch = keys.includes('shift') ? e.shiftKey : true;
            const altMatch = keys.includes('alt') ? e.altKey : true;
            
            const mainKey = keys.find(k => !['ctrl', 'shift', 'alt'].includes(k));
            const keyMatch = e.key.toLowerCase() === mainKey;
            
            if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
                e.preventDefault();
                callback(e);
            }
        });
    }

    // Public API
    return {
        showToast,
        showModal,
        hideModal,
        createSpinner,
        lazyLoadImages,
        smoothScrollTo,
        fadeToggle,
        debounce,
        throttle,
        copyToClipboard,
        vibrate,
        updateReadingProgress,
        addKeyboardShortcut
    };
})();

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIModule;
}
