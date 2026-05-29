/**
 * Advanced Features Module - Audio, Export, and additional capabilities
 * @module advanced
 */

const AdvancedModule = (function() {
    'use strict';

    /**
     * Text-to-Speech pronunciation using Web Speech API
     * @param {string} text - Text to speak
     * @param {string} lang - Language code (default: 'en-US')
     * @param {number} rate - Speech rate (0.5-2, default: 1)
     */
    function speak(text, lang = 'en-US', rate = 1) {
        if (!('speechSynthesis' in window)) {
            UIModule.showToast('Text-to-speech not supported', 'warning');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = rate;
        utterance.pitch = 1;
        
        utterance.onstart = () => {
            console.log('[Audio] Speaking:', text);
        };

        utterance.onerror = (event) => {
            console.error('[Audio] Speech error:', event);
        };

        window.speechSynthesis.speak(utterance);
    }

    /**
     * Speak with slow pronunciation for learning
     * @param {string} text - Text to speak slowly
     */
    function speakSlow(text) {
        speak(text, 'en-US', 0.7);
    }

    /**
     * Get available voices for TTS
     * @returns {Array} Available voices
     */
    function getVoices() {
        return new Promise((resolve) => {
            let voices = window.speechSynthesis.getVoices();
            
            if (voices.length > 0) {
                resolve(voices);
            } else {
                window.speechSynthesis.onvoiceschanged = () => {
                    voices = window.speechSynthesis.getVoices();
                    resolve(voices);
                };
            }
        });
    }

    /**
     * Export user progress as JSON
     * @returns {Object} Complete progress data
     */
    function exportProgress() {
        const progress = {
            app: 'English Grammar Master',
            version: '2.0.0',
            exportDate: new Date().toISOString(),
            data: {
                xp: StorageModule.getItem('xp', 0),
                badges: StorageModule.getItem('badges', []),
                streak: StorageModule.getItem('streak', 0),
                quizHistory: StorageModule.getItem('quiz-history', []),
                cardHistory: StorageModule.getItem('card-history', {}),
                theme: StorageModule.getItem('theme', 'light'),
                language: StorageModule.getItem('lang', 'roman'),
                fontSize: StorageModule.getItem('fontSize', 16)
            }
        };

        return progress;
    }

    /**
     * Download progress as JSON file
     */
    async function downloadProgress() {
        try {
            const progress = exportProgress();
            const blob = new Blob([JSON.stringify(progress, null, 2)], { 
                type: 'application/json' 
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `grammar-progress-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            UIModule.showToast('Progress exported successfully!', 'success');
        } catch (error) {
            console.error('[Export] Failed:', error);
            UIModule.showToast('Export failed', 'error');
        }
    }

    /**
     * Import progress from JSON file
     * @param {File} file - JSON file to import
     */
    function importProgress(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const progress = JSON.parse(e.target.result);
                    
                    // Validate structure
                    if (!progress.data) {
                        throw new Error('Invalid progress file');
                    }
                    
                    // Import data
                    Object.entries(progress.data).forEach(([key, value]) => {
                        StorageModule.setItem(key, value);
                    });
                    
                    UIModule.showToast('Progress imported! Refresh to see changes.', 'success');
                    resolve(true);
                } catch (error) {
                    console.error('[Import] Failed:', error);
                    UIModule.showToast('Import failed: Invalid file', 'error');
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                UIModule.showToast('Failed to read file', 'error');
                reject(new Error('File read error'));
            };
            
            reader.readAsText(file);
        });
    }

    /**
     * Generate certificate of completion
     * @param {string} userName - User's name
     */
    function generateCertificate(userName) {
        const stats = GamificationModule.getStats();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 800;
        canvas.height = 600;
        
        // Background
        const gradient = ctx.createLinearGradient(0, 0, 800, 600);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(1, '#8b5cf6');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        
        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 10;
        ctx.strokeRect(20, 20, 760, 560);
        
        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Certificate of Achievement', 400, 120);
        
        // Subtitle
        ctx.font = '24px Arial';
        ctx.fillText('English Grammar Master', 400, 180);
        
        // Presented to
        ctx.font = '20px Arial';
        ctx.fillText('This is presented to', 400, 250);
        
        // User name
        ctx.font = 'bold 36px Arial';
        ctx.fillText(userName || 'Learner', 400, 300);
        
        // Achievement details
        ctx.font = '20px Arial';
        ctx.fillText(`Level: ${stats.level}`, 400, 370);
        ctx.fillText(`XP Earned: ${stats.xp}`, 400, 410);
        ctx.fillText(`Badges: ${stats.badges}`, 400, 450);
        ctx.fillText(`Streak: ${stats.streak} days`, 400, 490);
        
        // Date
        const date = new Date().toLocaleDateString();
        ctx.font = '16px Arial';
        ctx.fillText(`Date: ${date}`, 400, 550);
        
        // Download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `certificate-${userName || 'learner'}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            UIModule.showToast('Certificate downloaded!', 'success');
        });
    }

    /**
     * Share achievement on social media
     * @param {string} platform - Platform (twitter, facebook, whatsapp)
     * @param {Object} stats - User stats
     */
    function shareAchievement(platform, stats) {
        const text = `I've reached ${stats.level} level in English Grammar Master with ${stats.xp} XP! 🎓🔥`;
        const url = window.location.href;
        
        let shareUrl;
        
        switch(platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
            default:
                // Use Web Share API if available
                if (navigator.share) {
                    navigator.share({
                        title: 'English Grammar Master',
                        text: text,
                        url: url
                    }).catch(err => console.log('Share cancelled'));
                    return;
                }
                return;
        }
        
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    /**
     * Create study reminder using Notifications API
     * @param {number} hours - Hours between reminders
     */
    async function setupStudyReminder(hours = 24) {
        if (!('Notification' in window)) {
            UIModule.showToast('Notifications not supported', 'warning');
            return;
        }

        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            setInterval(() => {
                new Notification('Time to Practice! 📚', {
                    body: 'Keep your streak going! Study English grammar now.',
                    icon: './icons/icon-192.png',
                    badge: './icons/icon.svg'
                });
            }, hours * 60 * 60 * 1000);
            
            UIModule.showToast('Study reminders enabled!', 'success');
        } else {
            UIModule.showToast('Please enable notifications', 'warning');
        }
    }

    /**
     * Print study guide
     */
    function printStudyGuide() {
        window.print();
    }

    // Public API
    return {
        speak,
        speakSlow,
        getVoices,
        exportProgress,
        downloadProgress,
        importProgress,
        generateCertificate,
        shareAchievement,
        setupStudyReminder,
        printStudyGuide
    };
})();

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedModule;
}
