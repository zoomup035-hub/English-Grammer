/**
 * Security Module - XSS prevention and input sanitization
 * @module security
 */

const SecurityModule = (function() {
    'use strict';

    /**
     * Sanitize HTML string to prevent XSS attacks
     * @param {string} html - Potentially unsafe HTML
     * @returns {string} Sanitized HTML
     */
    function sanitizeHTML(html) {
        if (typeof html !== 'string') return '';
        
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    /**
     * Create safe DOM element with text content
     * @param {string} tag - HTML tag name
     * @param {string} text - Text content (will be sanitized)
     * @param {Object} attributes - Optional attributes
     * @returns {HTMLElement} Safe DOM element
     */
    function createSafeElement(tag, text, attributes = {}) {
        const element = document.createElement(tag);
        element.textContent = text; // Safe by default
        
        // Add attributes safely
        Object.entries(attributes).forEach(([key, value]) => {
            if (key.startsWith('on')) {
                console.warn(`[Security] Blocked event handler attribute: ${key}`);
                return;
            }
            element.setAttribute(key, value);
        });
        
        return element;
    }

    /**
     * Safely set innerHTML with sanitization
     * @param {HTMLElement} element - Target element
     * @param {string} html - HTML content to set
     */
    function setInnerHTML(element, html) {
        if (!element) return;
        element.innerHTML = sanitizeHTML(html);
    }

    /**
     * Validate URL to prevent javascript: protocol
     * @param {string} url - URL to validate
     * @returns {boolean} Is URL safe
     */
    function isSafeURL(url) {
        if (typeof url !== 'string') return false;
        
        const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
        const lowerUrl = url.toLowerCase().trim();
        
        return !dangerousProtocols.some(protocol => lowerUrl.startsWith(protocol));
    }

    /**
     * Escape special characters for safe HTML insertion
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    function escapeHTML(text) {
        if (typeof text !== 'string') return '';
        
        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        
        return text.replace(/[&<>"']/g, char => escapeMap[char]);
    }

    /**
     * Generate random nonce for CSP
     * @returns {string} Random nonce string
     */
    function generateNonce() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Check if content contains potential XSS patterns
     * @param {string} content - Content to check
     * @returns {boolean} Contains suspicious patterns
     */
    function hasXSSPatterns(content) {
        if (typeof content !== 'string') return false;
        
        const xssPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /eval\s*\(/gi,
            /document\.(cookie|write|location)/gi
        ];
        
        return xssPatterns.some(pattern => pattern.test(content));
    }

    /**
     * Log security violation
     * @param {string} type - Violation type
     * @param {string} details - Violation details
     */
    function logSecurityViolation(type, details) {
        console.error(`[Security] ${type}:`, details);
        
        // In production, send to monitoring service
        // sendToMonitoring({ type, details, timestamp: Date.now() });
    }

    // Public API
    return {
        sanitizeHTML,
        createSafeElement,
        setInnerHTML,
        isSafeURL,
        escapeHTML,
        generateNonce,
        hasXSSPatterns,
        logSecurityViolation
    };
})();

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityModule;
}
