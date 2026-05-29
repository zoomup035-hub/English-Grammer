/**
 * Storage Module - Safe localStorage operations with error handling
 * @module storage
 */

const StorageModule = (function() {
    'use strict';

    /**
     * Safely get item from localStorage
     * @param {string} key - The storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} The stored value or default
     */
    function getItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            if (item === null) return defaultValue;
            
            // Try to parse as JSON first
            try {
                return JSON.parse(item);
            } catch (parseError) {
                // If parsing fails, return the raw string (for backward compatibility)
                console.warn(`[Storage] Item "${key}" is not valid JSON, returning raw value`);
                return item;
            }
        } catch (error) {
            console.warn(`[Storage] Failed to get "${key}":`, error.message);
            return defaultValue;
        }
    }

    /**
     * Safely set item in localStorage
     * @param {string} key - The storage key
     * @param {*} value - The value to store
     * @returns {boolean} Success status
     */
    function setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('[Storage] Quota exceeded. Clearing old data...');
                clearOldData();
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (retryError) {
                    console.error('[Storage] Failed to save after cleanup:', retryError.message);
                    return false;
                }
            }
            console.error(`[Storage] Failed to set "${key}":`, error.message);
            return false;
        }
    }

    /**
     * Remove item from localStorage
     * @param {string} key - The storage key
     * @returns {boolean} Success status
     */
    function removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`[Storage] Failed to remove "${key}":`, error.message);
            return false;
        }
    }

    /**
     * Clear old/unused data from storage
     * @private
     */
    function clearOldData() {
        const keysToRemove = [
            'temp_data',
            'cache_timestamp',
            'session_token'
        ];
        
        keysToRemove.forEach(key => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                // Ignore individual failures
            }
        });
        
        console.log('[Storage] Old data cleared');
    }

    /**
     * Get all storage keys
     * @returns {string[]} Array of storage keys
     */
    function getAllKeys() {
        try {
            return Object.keys(localStorage);
        } catch (error) {
            console.warn('[Storage] Failed to get keys:', error.message);
            return [];
        }
    }

    /**
     * Clear all storage (with confirmation)
     * @returns {boolean} Success status
     */
    function clearAll() {
        try {
            localStorage.clear();
            console.log('[Storage] All data cleared');
            return true;
        } catch (error) {
            console.error('[Storage] Failed to clear all:', error.message);
            return false;
        }
    }

    /**
     * Check if storage is available
     * @returns {boolean} Storage availability
     */
    function isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Public API
    return {
        getItem,
        setItem,
        removeItem,
        getAllKeys,
        clearAll,
        isAvailable
    };
})();

// Export for ES6 modules (if needed in future)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageModule;
}
