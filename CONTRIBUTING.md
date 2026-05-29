# Contributing to English Grammar Master

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/English.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Start development server: `npm run dev`

## 📋 Development Workflow

### Code Style
- Use 4 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Follow existing module pattern (IIFE)
- Add JSDoc comments for all functions

### Module Structure
```javascript
/**
 * Module Description
 * @module moduleName
 */

const ModuleName = (function() {
    'use strict';
    
    // Private variables
    let privateVar;
    
    /**
     * Public function description
     * @param {type} param - Parameter description
     * @returns {type} Return value description
     */
    function publicFunction(param) {
        // Implementation
    }
    
    // Public API
    return {
        publicFunction
    };
})();
```

### Testing Your Changes
1. Test in multiple browsers (Chrome, Firefox, Safari)
2. Verify offline functionality
3. Check mobile responsiveness
4. Test accessibility features
5. Run linter: `npm run lint`
6. Format code: `npm run format`

## 🎯 Areas Needing Contribution

### High Priority
- [ ] Unit tests for modules
- [ ] E2E testing setup
- [ ] Performance monitoring integration
- [ ] Analytics implementation
- [ ] Push notification system

### Medium Priority
- [ ] Additional quiz questions
- [ ] More flashcard decks
- [ ] Audio pronunciation feature
- [ ] Progress export (PDF)
- [ ] Social sharing features

### Low Priority
- [ ] Multi-language support beyond Urdu
- [ ] Voice recognition for practice
- [ ] AI-powered explanations
- [ ] Study reminders
- [ ] Leaderboard system

## 📝 Commit Messages

Follow conventional commits format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(quiz): add explanation display for answers
fix(theme): resolve dark mode toggle issue
docs(readme): update installation instructions
```

## 🔍 Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Submit PR with clear description
6. Address review feedback

### PR Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Tested on multiple devices
- [ ] Accessibility verified
- [ ] Performance impact checked

## 🐛 Reporting Bugs

Use the bug report template and include:
- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser and device information
- Console errors

## 💡 Feature Requests

When suggesting features:
- Explain the problem it solves
- Describe the proposed solution
- Consider alternatives
- Provide use cases
- Indicate priority level

## 📚 Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [Web Accessibility Initiative](https://www.w3.org/WAI/)
- [Progressive Web Apps Guide](https://web.dev/progressive-web-apps/)
- [JavaScript Info](https://javascript.info/)

## 🙏 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn
- Maintain professional communication

## 📞 Getting Help

- Open an issue for questions
- Join discussions in existing issues
- Read documentation thoroughly
- Check closed issues for solutions

---

Thank you for contributing to make English Grammar Master better! 🎉
