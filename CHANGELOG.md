# Changelog

All notable changes to English Grammar Master will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-05-29

### 🎉 Added
- Modular architecture with separated concerns (storage, theme, quiz, flashcards, gamification, ui, security)
- Content Security Policy (CSP) headers for enhanced security
- XSS prevention through HTML sanitization utilities
- Comprehensive error handling for localStorage operations
- Build system with Vite for production optimization
- ESLint and Prettier configuration for code quality
- JSDoc documentation for all modules
- README.md with comprehensive documentation
- Keyboard shortcuts (Ctrl+K for search, Escape to close modals)
- Focus trapping in modal dialogs
- ARIA labels and roles for better accessibility
- Lazy loading support with Intersection Observer
- Toast notification system with types (info, success, error, warning)
- Spaced repetition algorithm for flashcards
- Confetti animations for achievements

### 🔧 Changed
- Optimized CSS transitions (removed universal selector transitions)
- Enhanced service worker with module caching
- Improved theme toggle with night owl tracking
- Refactored quiz module with better state management
- Updated package.json with build scripts and dev dependencies
- Service worker version bumped to v5 with improved strategies

### ♿ Accessibility
- Added role attributes to semantic elements
- Implemented ARIA labels for all interactive elements
- Added aria-live regions for dynamic content
- Improved keyboard navigation throughout app
- Focus indicators for all focusable elements
- Screen reader compatibility enhancements

### ⚡ Performance
- Removed expensive universal CSS transitions
- Added preconnect hints for external resources
- Implemented debounced scroll handlers
- Code splitting ready with Vite configuration
- Minification and tree-shaking support
- Reduced initial bundle size through modularization

### 🔒 Security
- Content Security Policy implementation
- HTML sanitization to prevent XSS attacks
- Safe DOM element creation utilities
- URL validation helpers
- Event handler attribute blocking

## [1.0.0] - 2026-05-11

### 🎉 Initial Release
- Complete English grammar guide in Roman Urdu
- 12 tenses with formulas and examples
- Parts of speech detailed explanations
- Interactive quiz system with 20 questions
- Flashcard decks (5 specialized decks)
- Sentence scramble practice
- Gamification (XP, levels, badges, streaks)
- Dark/light mode toggle
- Language toggle (Roman Urdu ↔ Urdu)
- Font size adjustment
- Progressive Web App with offline support
- Service worker implementation
- Install prompt for mobile devices
- Reading progress indicator
- Splash screen animation
- Bottom navigation for mobile
- Search functionality
- Common errors section
- Active/Passive voice tables
- Direct/Indirect speech guide
- Timeline visualization
- Cheat sheet reference

---

## Version Guidelines

### Version Number Format: MAJOR.MINOR.PATCH

- **MAJOR**: Breaking changes or major feature additions
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes and minor improvements

### Emoji Legend
- 🎉 Added - New features
- 🔧 Changed - Changes in existing functionality
- 🐛 Fixed - Bug fixes
- ♿ Accessibility - Accessibility improvements
- ⚡ Performance - Performance optimizations
- 🔒 Security - Security enhancements
- 📝 Documentation - Documentation updates
- 🗑️ Deprecated - Soon to be removed features
- ❌ Removed - Removed features
