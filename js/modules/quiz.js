/**
 * Quiz Module - Handles quiz logic, scoring, and progress tracking
 * @module quiz
 */

const QuizModule = (function() {
    'use strict';

    // Private state
    let currentQuestionIndex = 0;
    let score = 0;
    let answeredQuestions = [];
    let quizStartTime = null;

    /**
     * Initialize quiz module
     */
    function init() {
        loadProgress();
        console.log('[Quiz] Initialized');
    }

    /**
     * Start a new quiz
     * @param {Array} questions - Array of quiz questions
     */
    function startQuiz(questions) {
        currentQuestionIndex = 0;
        score = 0;
        answeredQuestions = [];
        quizStartTime = Date.now();
        
        saveProgress();
        renderQuestion(questions[currentQuestionIndex]);
    }

    /**
     * Answer current question
     * @param {number} selectedOption - Selected option index
     * @param {Array} questions - Array of quiz questions
     * @returns {Object} Result with correctness and explanation
     */
    function answerQuestion(selectedOption, questions) {
        const question = questions[currentQuestionIndex];
        const isCorrect = selectedOption === question.correct;
        
        if (isCorrect) {
            score += 10; // Base XP per question
        }
        
        answeredQuestions.push({
            questionIndex: currentQuestionIndex,
            selected: selectedOption,
            correct: isCorrect,
            timestamp: Date.now()
        });
        
        // Check for perfect score bonus
        if (answeredQuestions.length === questions.length && 
            answeredQuestions.every(a => a.correct)) {
            score += 50; // Perfect score bonus
        }
        
        saveProgress();
        
        return {
            isCorrect,
            explanation: question.explanation,
            score: score
        };
    }

    /**
     * Move to next question
     * @param {Array} questions - Array of quiz questions
     * @returns {boolean} Has more questions
     */
    function nextQuestion(questions) {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            renderQuestion(questions[currentQuestionIndex]);
            return true;
        } else {
            finishQuiz();
            return false;
        }
    }

    /**
     * Finish quiz and calculate final results
     * @returns {Object} Final results
     */
    function finishQuiz() {
        const totalTime = Date.now() - quizStartTime;
        const accuracy = answeredQuestions.filter(a => a.correct).length / answeredQuestions.length * 100;
        
        const results = {
            score: score,
            totalQuestions: answeredQuestions.length,
            correctAnswers: answeredQuestions.filter(a => a.correct).length,
            accuracy: accuracy,
            timeTaken: totalTime,
            xpEarned: score
        };
        
        // Save to history
        saveQuizHistory(results);
        
        // Update gamification
        window.dispatchEvent(new CustomEvent('quiz-complete', { detail: results }));
        
        console.log('[Quiz] Completed:', results);
        return results;
    }

    /**
     * Render current question to DOM
     * @param {Object} question - Question object
     * @private
     */
    function renderQuestion(question) {
        const questionEl = document.getElementById('question-text');
        const optionsEl = document.getElementById('options-container');
        
        if (!questionEl || !optionsEl) return;
        
        // Sanitize content to prevent XSS
        questionEl.textContent = question.q;
        
        // Clear previous options
        optionsEl.innerHTML = '';
        
        // Create option buttons
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option; // Safe textContent instead of innerHTML
            button.setAttribute('data-index', index);
            button.setAttribute('aria-label', `Option ${index + 1}: ${option}`);
            
            button.addEventListener('click', () => handleOptionClick(index));
            optionsEl.appendChild(button);
        });
        
        updateProgress();
    }

    /**
     * Handle option button click
     * @param {number} index - Selected option index
     * @private
     */
    function handleOptionClick(index) {
        // Disable all buttons
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        // Get current questions from global scope (will be refactored later)
        const questions = window.QuizData || [];
        const result = answerQuestion(index, questions);
        
        // Show feedback
        showFeedback(result);
        
        // Enable next button
        const nextBtn = document.getElementById('next-question');
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.onclick = () => nextQuestion(questions);
        }
    }

    /**
     * Show answer feedback
     * @param {Object} result - Answer result
     * @private
     */
    function showFeedback(result) {
        const feedbackEl = document.getElementById('feedback');
        if (!feedbackEl) return;
        
        feedbackEl.innerHTML = `
            <div class="feedback-${result.isCorrect ? 'correct' : 'incorrect'}">
                <i class="fas fa-${result.isCorrect ? 'check-circle' : 'times-circle'}"></i>
                <p>${result.isCorrect ? 'Correct!' : 'Incorrect'}</p>
                <p class="explanation">${sanitizeHTML(result.explanation)}</p>
            </div>
        `;
    }

    /**
     * Update progress indicator
     * @private
     */
    function updateProgress() {
        const progressEl = document.getElementById('quiz-progress');
        if (progressEl) {
            const questions = window.QuizData || [];
            const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
            progressEl.style.width = progress + '%';
        }
    }

    /**
     * Save quiz progress to storage
     * @private
     */
    function saveProgress() {
        StorageModule.setItem('quiz-progress', {
            currentQuestionIndex,
            score,
            answeredQuestions,
            quizStartTime
        });
    }

    /**
     * Load quiz progress from storage
     * @private
     */
    function loadProgress() {
        const progress = StorageModule.getItem('quiz-progress');
        if (progress) {
            currentQuestionIndex = progress.currentQuestionIndex || 0;
            score = progress.score || 0;
            answeredQuestions = progress.answeredQuestions || [];
            quizStartTime = progress.quizStartTime || Date.now();
        }
    }

    /**
     * Save quiz results to history
     * @param {Object} results - Quiz results
     * @private
     */
    function saveQuizHistory(results) {
        const history = StorageModule.getItem('quiz-history', []);
        history.push({
            ...results,
            date: new Date().toISOString()
        });
        
        // Keep only last 50 quizzes
        if (history.length > 50) {
            history.splice(0, history.length - 50);
        }
        
        StorageModule.setItem('quiz-history', history);
    }

    /**
     * Sanitize HTML to prevent XSS
     * @param {string} html - HTML string to sanitize
     * @returns {string} Sanitized string
     * @private
     */
    function sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    /**
     * Get current score
     * @returns {number} Current score
     */
    function getScore() {
        return score;
    }

    /**
     * Get current question index
     * @returns {number} Current question index
     */
    function getCurrentIndex() {
        return currentQuestionIndex;
    }

    // Public API
    return {
        init,
        startQuiz,
        answerQuestion,
        nextQuestion,
        finishQuiz,
        getScore,
        getCurrentIndex
    };
})();

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuizModule;
}
