# English Grammar Master - PWA

A comprehensive Progressive Web App for learning English grammar in Roman Urdu, featuring 12 tenses, parts of speech, interactive quizzes, flashcards, and gamification.

## 🚀 Features

### Core Learning
- **12 English Tenses** - Complete guide with formulas, examples, and Roman Urdu explanations
- **Parts of Speech** - Detailed breakdown of nouns, verbs, adjectives, adverbs, etc.
- **Interactive Quizzes** - 20+ questions with instant feedback and explanations
- **Flashcard Decks** - 5 specialized decks with spaced repetition algorithm
- **Sentence Scramble** - Practice sentence construction
- **Common Errors** - Learn from typical mistakes

### Gamification
- **XP System** - Earn points for completing activities
- **Level Progression** - 7 levels from Beginner to Grandmaster
- **Achievement Badges** - Unlock 8+ badges for milestones
- **Daily Streaks** - Track consecutive study days
- **Confetti Celebrations** - Visual rewards for achievements

### User Experience
- **Dark/Light Mode** - Toggle between themes
- **Font Size Control** - Adjustable text size (12px-24px)
- **Roman Urdu/Urdu Toggle** - Switch languages
- **Offline Support** - Full functionality without internet
- **Progress Tracking** - Persistent progress via localStorage
- **Reading Progress Bar** - Visual scroll indicator

### Accessibility
- **Keyboard Navigation** - Full keyboard support
- **ARIA Labels** - Screen reader compatible
- **Focus Management** - Proper focus indicators
- **Reduced Motion** - Respects user preferences

## 📱 Installation

### As PWA (Recommended)
1. Open the app in your browser
2. Click "Install" when prompted
3. Access from home screen like a native app

### Manual Setup
```bash
# Clone repository
git clone <repository-url>
cd English

# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 🏗️ Architecture

### Modular Structure
```
js/
├── app.js                 # Main application entry point
└── modules/
    ├── storage.js         # Safe localStorage operations
    ├── security.js        # XSS prevention & sanitization
    ├── theme.js           # Theme, language, font management
    ├── gamification.js    # XP, levels, badges system
    ├── quiz.js            # Quiz logic & scoring
    ├── flashcards.js      # Flashcard decks & spaced repetition
    └── ui.js              # UI utilities & animations
```

### Module Responsibilities

#### StorageModule
- Safe localStorage operations with error handling
- Quota exceeded detection and cleanup
- JSON serialization/deserialization

#### SecurityModule
- HTML sanitization to prevent XSS attacks
- Safe DOM element creation
- URL validation
- CSP compliance helpers

#### ThemeModule
- Dark/light theme switching
- Language toggle (Roman Urdu ↔ Urdu)
- Font size adjustment
- Night owl badge tracking

#### GamificationModule
- XP calculation and level progression
- Badge unlocking system
- Daily streak tracking
- Toast notifications

#### QuizModule
- Question rendering and navigation
- Answer validation with explanations
- Score calculation
- Quiz history tracking

#### FlashcardModule
- Deck management (5 specialized decks)
- Spaced repetition algorithm (SM-2 simplified)
- Card rating and review scheduling
- Performance statistics

#### UIModule
- Toast notifications
- Modal dialogs with focus trapping
- Lazy loading images
- Smooth scrolling
- Debounce/throttle utilities
- Clipboard operations

## 🔧 Configuration

### Environment Variables
Create `.env` file for custom configuration:
```env
VITE_APP_VERSION=2.0.0
VITE_API_URL=https://api.example.com
```

### Service Worker
The service worker (`sw.js`) implements multiple caching strategies:
- **App Shell**: Cache-first for core files
- **Static Assets**: Stale-while-revalidate
- **Images**: Cache-first with size limits
- **Fonts**: Cache-first for offline availability
- **Dynamic Content**: Network-first with cache fallback

## 📊 Performance Optimizations

### Implemented
- ✅ CSS transitions only on interactive elements
- ✅ Lazy loading with Intersection Observer
- ✅ Debounced scroll handlers
- ✅ Preconnect to external domains
- ✅ Code splitting ready (Vite)
- ✅ Minification and tree-shaking
- ✅ Service worker caching

### Metrics Targets
- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Bundle Size: < 200KB gzipped

## ♿ Accessibility

### WCAG 2.1 AA Compliance
- Color contrast ratios verified
- Keyboard navigation tested
- Screen reader compatibility
- Focus management in modals
- ARIA labels and live regions
- Reduced motion support

### Keyboard Shortcuts
- `Ctrl+K`: Focus search
- `Escape`: Close modals
- `Tab`: Navigate interactive elements

## 🧪 Testing

### Manual Testing Checklist
- [ ] PWA installation works
- [ ] Offline mode functional
- [ ] All quizzes complete successfully
- [ ] Flashcards load and flip
- [ ] Theme toggle persists
- [ ] Badges unlock correctly
- [ ] Mobile responsive design
- [ ] Cross-browser compatibility

### Browser Testing
- Chrome/Edge (latest)
- Firefox (latest)
- Safari iOS (latest)
- Samsung Internet

## 🔄 Update History

### v2.0.0 (Current)
- ✨ Modular architecture implemented
- 🔒 Security enhancements (XSS prevention, CSP)
- ♿ Accessibility improvements
- ⚡ Performance optimizations
- 🛠️ Build system (Vite) added
- 📝 Comprehensive documentation

### v1.0.0
- Initial release
- Core grammar content
- Basic PWA features
- Gamification system

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style
- Use ESLint rules defined in `.eslintrc.json`
- Format code with Prettier
- Add JSDoc comments for functions
- Follow existing module pattern

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Inter font family
- Noto Nastaliq Urdu for Urdu script

## 📞 Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Email: support@example.com

---

**Built with ❤️ by Jang Pagloo**

*Learn English grammar the easy way!*
