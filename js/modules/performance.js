/**
 * Performance Module - Monitor and optimize app performance
 * @module performance
 */

const PerformanceModule = (function() {
    'use strict';

    /**
     * Measure page load performance
     */
    function measurePageLoad() {
        if (!window.performance) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const connectTime = perfData.responseEnd - perfData.requestStart;
                const renderTime = perfData.domComplete - perfData.domLoading;

                console.log('[Performance] Page Load:', {
                    total: pageLoadTime + 'ms',
                    network: connectTime + 'ms',
                    render: renderTime + 'ms'
                });

                // Send to analytics in production
                // sendMetrics({ pageLoadTime, connectTime, renderTime });
            }, 0);
        });
    }

    /**
     * Measure function execution time
     * @param {string} label - Measurement label
     * @returns {Function} Function to stop measurement
     */
    function measureFunction(label) {
        const start = performance.now();
        
        return function() {
            const end = performance.now();
            const duration = end - start;
            console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
            return duration;
        };
    }

    /**
     * Check Core Web Vitals
     */
    function checkWebVitals() {
        // First Contentful Paint
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('[Performance] FCP:', entry.startTime + 'ms');
            }
        }).observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('[Performance] LCP:', entry.startTime + 'ms');
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('[Performance] FID:', entry.processingStart - entry.startTime + 'ms');
            }
        }).observe({ entryTypes: ['first-input'] });
    }

    /**
     * Lazy load resources on demand
     * @param {string} src - Resource URL
     * @param {string} type - Resource type (script, style)
     * @returns {Promise} Load promise
     */
    function lazyLoadResource(src, type = 'script') {
        return new Promise((resolve, reject) => {
            if (type === 'script') {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            } else if (type === 'style') {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = src;
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            }
        });
    }

    /**
     * Optimize images with lazy loading
     * @param {NodeList} images - Image elements
     */
    function optimizeImages(images) {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    /**
     * Debounce expensive operations
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    function debounce(func, wait = 300) {
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
     * Throttle frequent operations
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     * @returns {Function} Throttled function
     */
    function throttle(func, limit = 200) {
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
     * Preload critical resources
     * @param {Array} resources - Array of resource URLs
     */
    function preloadResources(resources) {
        resources.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = getResourceType(src);
            link.href = src;
            document.head.appendChild(link);
        });
    }

    /**
     * Determine resource type from URL
     * @param {string} url - Resource URL
     * @returns {string} Resource type
     * @private
     */
    function getResourceType(url) {
        if (url.endsWith('.js')) return 'script';
        if (url.endsWith('.css')) return 'style';
        if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) return 'image';
        if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'font';
        return 'fetch';
    }

    /**
     * Clear browser cache programmatically (for development)
     */
    function clearCache() {
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                    console.log('[Performance] Cache deleted:', name);
                });
            });
        }
    }

    // Initialize performance monitoring
    measurePageLoad();
    checkWebVitals();

    // Public API
    return {
        measureFunction,
        lazyLoadResource,
        optimizeImages,
        debounce,
        throttle,
        preloadResources,
        clearCache
    };
})();

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceModule;
}
