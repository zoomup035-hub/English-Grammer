/**
 * Theme Module - Handles theme switching, language toggle, and font size
 * @module theme
 */

const ThemeModule = (function() {
    'use strict';

    // Private state
    let currentTheme = 'light';
    let currentLang = 'roman';
    let currentFontSize = 16;

    /**
     * Initialize theme from storage or defaults
     */
    function init() {
        currentTheme = StorageModule.getItem('theme', 'light');
        currentLang = StorageModule.getItem('lang', 'roman');
        currentFontSize = StorageModule.getItem('fontSize', 16);
        
        applyTheme(currentTheme);
        applyLanguage(currentLang);
        applyFontSize(currentFontSize);
        
        console.log('[Theme] Initialized:', { theme: currentTheme, lang: currentLang, fontSize: currentFontSize });
    }

    /**
     * Toggle between light and dark themes
     * @returns {string} New theme name
     */
    function toggleTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
        StorageModule.setItem('theme', currentTheme);
        
        // Track night owl badge
        if (currentTheme === 'dark') {
            trackNightOwl();
        }
        
        return currentTheme;
    }

    /**
     * Apply theme to document
     * @param {string} theme - 'light' or 'dark'
     * @private
     */
    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
    }

    /**
     * Update theme toggle icon
     * @param {string} theme - Current theme
     * @private
     */
    function updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
        }
    }

    /**
     * Set language preference
     * @param {string} lang - 'roman' or 'urdu'
     */
    function setLanguage(lang) {
        currentLang = lang;
        applyLanguage(lang);
        StorageModule.setItem('lang', lang);
    }

    /**
     * Apply language settings to DOM
     * @param {string} lang - Language code
     * @private
     */
    function applyLanguage(lang) {
        const langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        if (lang === 'urdu') {
            document.body.classList.add('urdu-active');
        } else {
            document.body.classList.remove('urdu-active');
        }

        // Update text content based on language
        updateLanguageContent(lang);
    }

    /**
     * Update content based on selected language
     * @param {string} lang - Language code
     * @private
     */
    function updateLanguageContent(lang) {
        const targets = document.querySelectorAll('[data-urdu]:not(.formula):not(.en)');
        
        targets.forEach(el => {
            if (!el.hasAttribute('data-roman')) {
                el.setAttribute('data-roman', el.textContent);
            }
            
            if (lang === 'urdu' && el.hasAttribute('data-urdu')) {
                el.textContent = el.getAttribute('data-urdu');
            } else if (el.hasAttribute('data-roman')) {
                el.textContent = el.getAttribute('data-roman');
            }
        });
    }

    /**
     * Increase font size
     * @param {number} step - Font size increment
     * @returns {number} New font size
     */
    function increaseFontSize(step = 2) {
        const MAX_FONT_SIZE = 24;
        currentFontSize = Math.min(currentFontSize + step, MAX_FONT_SIZE);
        applyFontSize(currentFontSize);
        StorageModule.setItem('fontSize', currentFontSize);
        return currentFontSize;
    }

    /**
     * Decrease font size
     * @param {number} step - Font size decrement
     * @returns {number} New font size
     */
    function decreaseFontSize(step = 2) {
        const MIN_FONT_SIZE = 12;
        currentFontSize = Math.max(currentFontSize - step, MIN_FONT_SIZE);
        applyFontSize(currentFontSize);
        StorageModule.setItem('fontSize', currentFontSize);
        return currentFontSize;
    }

    /**
     * Apply font size to document
     * @param {number} size - Font size in pixels
     * @private
     */
    function applyFontSize(size) {
        document.documentElement.style.setProperty('--font-size', size + 'px');
    }

    /**
     * Track night owl usage for badge
     * @private
     */
    function trackNightOwl() {
        let nightCount = StorageModule.getItem('nightCount', 0);
        nightCount++;
        StorageModule.setItem('nightCount', nightCount);
        
        if (nightCount >= 5) {
            // Trigger badge check (will be handled by gamification module)
            window.dispatchEvent(new CustomEvent('badge-check', { 
                detail: { badge: 'night_owl' } 
            }));
        }
    }

    /**
     * Get current theme
     * @returns {string} Current theme
     */
    function getCurrentTheme() {
        return currentTheme;
    }

    /**
     * Get current language
     * @returns {string} Current language
     */
    function getCurrentLang() {
        return currentLang;
    }

    /**
     * Get current font size
     * @returns {number} Current font size
     */
    function getCurrentFontSize() {
        return currentFontSize;
    }

    // Public API
    return {
        init,
        toggleTheme,
        setLanguage,
        increaseFontSize,
        decreaseFontSize,
        getCurrentTheme,
        getCurrentLang,
        getCurrentFontSize
    };
})();

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeModule;
}
