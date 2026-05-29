# Quick Start Guide

## For Users

### Installing the App
1. **On Desktop (Chrome/Edge)**:
   - Click the install icon in the address bar
   - Select "Install English Grammar Master"
   - Access from desktop or start menu

2. **On Mobile (Android)**:
   - Tap the menu (⋮) in Chrome
   - Select "Install app" or "Add to Home screen"
   - Launch from home screen like any app

3. **On iOS (iPhone/iPad)**:
   - Tap the share button (square with arrow)
   - Scroll and select "Add to Home Screen"
   - Open from home screen

### Using the App
- **Navigate**: Use top nav (desktop) or bottom nav (mobile)
- **Search**: Press `Ctrl+K` or use search bar
- **Dark Mode**: Click moon icon in top right
- **Font Size**: Use +/- buttons to adjust text size
- **Language**: Toggle between Roman Urdu and Urdu
- **Offline**: Works without internet after first load

---

## For Developers

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Modern browser (Chrome, Firefox, Safari, Edge)

### Setup (5 minutes)

```bash
# 1. Clone the repository
git clone <repository-url>
cd English

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# App will open automatically at http://localhost:3000
```

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Generate PWA icons
npm run generate-icons
```

### Project Structure

```
English/
├── js/
│   ├── app.js                 # Main entry point
│   └── modules/               # Feature modules
│       ├── storage.js         # localStorage wrapper
│       ├── security.js        # XSS prevention
│       ├── theme.js           # Theme/language
│       ├── gamification.js    # XP/badges
│       ├── quiz.js            # Quiz logic
│       ├── flashcards.js      # Flashcard system
│       ├── ui.js              # UI utilities
│       ├── performance.js     # Performance monitoring
│       └── advanced.js        # Advanced features
├── index.html                 # Main HTML
├── style.css                  # Styles
├── script.js                  # Legacy script (backward compat)
├── sw.js                      # Service worker
├── manifest.json              # PWA manifest
├── offline.html               # Offline page
└── vite.config.js             # Vite configuration
```

### Making Changes

#### Adding a New Module
```javascript
// Create js/modules/mymodule.js
const MyModule = (function() {
    'use strict';
    
    function myFunction() {
        // Implementation
    }
    
    return { myFunction };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MyModule;
}
```

Then include in `index.html`:
```html
<script src="js/modules/mymodule.js"></script>
```

#### Modifying Existing Features
1. Find the relevant module in `js/modules/`
2. Make your changes
3. Test with `npm run dev`
4. Format code: `npm run format`
5. Check for errors: `npm run lint`

### Debugging

#### Browser DevTools
- **Console**: View logs and errors
- **Network**: Check resource loading
- **Application**: Inspect localStorage, service worker
- **Lighthouse**: Audit performance, accessibility

#### Common Issues

**Service Worker not updating?**
```javascript
// In browser console
navigator.serviceWorker.getRegistration().then(reg => {
    if (reg) reg.unregister();
});
// Then refresh page
```

**LocalStorage full?**
```javascript
// Clear all data
localStorage.clear();
location.reload();
```

**Styles not updating?**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear cache in DevTools Application tab

### Testing

#### Manual Testing Checklist
```bash
# 1. Development mode
npm run dev

# 2. Test features:
#    - Theme toggle
#    - Language switch
#    - Font size adjustment
#    - Quiz completion
#    - Flashcard navigation
#    - Badge unlocking
#    - Offline mode

# 3. Production build
npm run build
npm run preview

# 4. Test PWA installation
# 5. Test offline functionality
```

#### Browser Testing
Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest) - macOS/iOS
- Edge (latest)
- Samsung Internet (Android)

### Deployment

#### Option 1: GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

#### Option 2: Netlify
```bash
# Drag and drop dist folder to netlify.com
# Or connect GitHub repo for auto-deploy
```

#### Option 3: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Make changes following code style
4. Test thoroughly
5. Commit: `git commit -m 'feat: add my feature'`
6. Push: `git push origin feature/my-feature`
7. Open Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## Troubleshooting

### App won't load
1. Clear browser cache
2. Unregister service worker
3. Clear localStorage
4. Hard refresh page

### Icons not showing
```bash
npm run generate-icons
```

### Build fails
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

### Performance issues
1. Run Lighthouse audit
2. Check Console for errors
3. Verify service worker caching
4. Test on different devices

---

## Resources

- **[README.md](README.md)** - Complete documentation
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guide
- **[IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md)** - What's new in v2.0

### External Resources
- [Vite Documentation](https://vitejs.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Web.dev Guides](https://web.dev/)
- [PWA Checklist](https://web.dev/pwa-checklist/)

---

## Support

- **Issues**: Open on GitHub
- **Questions**: Check existing issues or discussions
- **Features**: Submit feature request with use case

---

**Happy Coding! 🚀**
