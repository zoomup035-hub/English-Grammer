// ============================================
// ENGLISH GRAMMAR MASTER — Professional Script
// ============================================

// ============================================
// CONSTANTS & CONFIG
// ============================================
const CONSTANTS = {
    MAX_FONT_SIZE: 24,
    MIN_FONT_SIZE: 12,
    FONT_STEP: 2,
    XP_PER_QUESTION: 10,
    XP_PERFECT_BONUS: 50,
    XP_SCRAMBLE: 20,
    XP_CHALLENGE: 50,
    STREAK_BADGE_DAYS: 3,
    SCHOLAR_XP: 1000,
    NIGHT_COUNT_BADGE: 5,
    LEVEL_XP_STEP: 500,
    CONFETTI_COUNT: 80,
    SWIPE_THRESHOLD: 50,
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 3000,
    SPLASH_DURATION: 1000
};

const LEVELS = [
    "Beginner", "Learner", "Intermediate", "Expert", 
    "Grammar Master", "Legend", "Grandmaster"
];

const GRAMMAR_TIPS = [
    "Tip: 'I' hamesha Capital likha jata hai, jumle ke beech mein bhi.",
    "Tip: 's/es' sirf He, She, It aur Singular nouns ke saath lagta hai.",
    "Tip: 'Since' point of time (e.g. 2 PM) ke liye aur 'For' duration (e.g. 2 hours) ke liye use hota hai.",
    "Tip: 'A' consonant sounds ke liye aur 'An' vowel sounds (a,e,i,o,u) ke liye use hota hai.",
    "Tip: 'Few' countable nouns ke liye, 'Little' uncountable nouns ke liye.",
    "Tip: 'Many' countable, 'Much' uncountable ke liye use hota hai.",
    "Tip: Active voice mein subject pehle, Passive mein object pehle aata hai.",
    "Tip: 'Would' polite requests ke liye, 'Will' future ke liye use hota hai."
];

// ============================================
// DOM ELEMENTS CACHE
// ============================================
const DOM = {
    body: document.body,
    themeToggle: document.getElementById('themeToggle'),
    fontIncrease: document.getElementById('fontIncrease'),
    fontDecrease: document.getElementById('fontDecrease'),
    progress: document.getElementById('readingProgress'),
    backToTop: document.getElementById('backToTop'),
    searchInput: document.getElementById('globalSearch'),
    emptyState: document.getElementById('emptyState'),
    sections: document.querySelectorAll('section[id], .section[id]'),
    navLinks: document.querySelectorAll('.nav-link'),
    langBtns: document.querySelectorAll('.lang-btn'),
    badgeBtn: document.getElementById('badgeCount')?.parentElement,
    flashcardEl: document.getElementById('flashcard'),
    toastContainer: document.getElementById('toastContainer')
};

// ============================================
// STATE MANAGEMENT
// ============================================
const State = {
    currentFontSize: 16,
    currentCardIndex: 0,
    currentQuizIdx: 0,
    score: 0,
    currentScrambleIdx: 0,
    currentDeck: 'all',
    currentCardInDeck: 0,
    deferredPrompt: null,
    wakeLock: null
};

// ============================================
// FLASHCARD DECKS DATA (5 Decks)
// ============================================
const FlashcardDecks = {
    all: {
        name: "📚 All Cards",
        cards: [
            { front: "What is a Noun?", back: "Naam (Person, Place, Thing, Idea)" },
            { front: "What is a Verb?", back: "Kaam (Action, State, or Occurrence)" },
            { front: "What is an Adjective?", back: "Sifat (Describes or modifies a Noun)" },
            { front: "What is a Pronoun?", back: "Zameer (Replaces a Noun: he, she, it, they)" },
            { front: "What is an Adverb?", back: "Fael ko modify karta hai (quickly, very, well)" },
            { front: "Present Simple Formula?", back: "Subject + V1 (+s/es for 3rd person)" },
            { front: "Present Continuous Formula?", back: "Subject + is/am/are + V-ing" },
            { front: "Past Simple Formula?", back: "Subject + V2 (past form)" },
            { front: "Past Perfect Formula?", back: "Subject + had + V3 (past participle)" },
            { front: "Future Simple Formula?", back: "Subject + will/shall + V1" },
            { front: "What is a Preposition?", back: "Harf-e-Jar: shows relationship (in, on, at, by, with)" },
            { front: "What is a Conjunction?", back: "Harf-e-Atf: joins words/clauses (and, but, or, because)" },
            { front: "What is an Interjection?", back: "Harf-e-Nida: expresses emotion (Wow! Alas! Hurray!)" },
            { front: "Active Voice Formula?", back: "Subject + Verb + Object (He writes a letter)" },
            { front: "Passive Voice Formula?", back: "Object + be + V3 + by + Subject (A letter is written by him)" }
        ]
    },
    noun: {
        name: "🏷️ Noun Deck",
        cards: [
            { front: "Proper Noun", back: "Specific name: Pakistan, Karachi, Ali, Monday" },
            { front: "Common Noun", back: "General name: city, boy, country, animal" },
            { front: "Abstract Noun", back: "Name of idea/quality: love, honesty, bravery, happiness" },
            { front: "Collective Noun", back: "Group name: team, flock, army, committee" },
            { front: "Countable Noun", back: "Can be counted: book, apple, student (singular/plural)" }
        ]
    },
    verb: {
        name: "🏃 Verb Deck",
        cards: [
            { front: "Action Verb", back: "Shows action: run, eat, write, play" },
            { front: "Linking Verb", back: "Connects subject to info: is, seems, becomes, looks" },
            { front: "Helping Verb (Auxiliary)", back: "Helps main verb: is, have, will, can, may" },
            { front: "Modal Verb", back: "Shows ability/possibility: can, could, may, might, must" },
            { front: "Transitive Verb", back: "Needs object: She reads 'books' (object required)" }
        ]
    },
    tense: {
        name: "⏰ Tense Deck",
        cards: [
            { front: "Present Perfect Continuous", back: "has/have been + V-ing: I have been waiting." },
            { front: "Past Perfect Continuous", back: "had been + V-ing: I had been studying." },
            { front: "Future Perfect", back: "will have + V3: By 2026, I will have graduated." },
            { front: "Future Perfect Continuous", back: "will have been + V-ing: I will have been working." },
            { front: "Present Perfect vs Past Simple", back: "Perfect = unfinished time (today), Simple = finished time (yesterday)" }
        ]
    },
    adjective: {
        name: "✨ Adjective Deck",
        cards: [
            { front: "Descriptive Adjective", back: "Describes quality: beautiful, tall, smart, red" },
            { front: "Quantitative Adjective", back: "Shows amount: some, much, little, enough" },
            { front: "Demonstrative Adjective", back: "Points out: this, that, these, those" },
            { front: "Possessive Adjective", back: "Shows ownership: my, your, his, her, its, our, their" },
            { front: "Comparative Adjective", back: "Compares two: taller, smarter, more beautiful" }
        ]
    },
    adverb: {
        name: "🕐 Adverb Deck",
        cards: [
            { front: "Adverb of Time", back: "When? now, then, today, yesterday, soon, already" },
            { front: "Adverb of Place", back: "Where? here, there, everywhere, outside, upstairs" },
            { front: "Adverb of Manner", back: "How? quickly, slowly, well, badly, carefully" },
            { front: "Adverb of Degree", back: "How much? very, quite, almost, too, enough" },
            { front: "Adverb of Frequency", back: "How often? always, often, sometimes, rarely, never" }
        ]
    }
};

// ============================================
// QUIZ DATA (20 Questions)
// ============================================
const QuizData = [
    { q: "He ___ to school every day.", options: ["go", "goes", "going", "gone"], correct: 1, explanation: "He = 3rd person singular → goes with 's'" },
    { q: "Yesterday, I ___ a delicious pizza.", options: ["eat", "eats", "ate", "eaten"], correct: 2, explanation: "Yesterday = Past Simple → V2 form: ate" },
    { q: "They ___ playing cricket right now.", options: ["is", "am", "are", "was"], correct: 2, explanation: "They = plural + right now = Present Continuous → are" },
    { q: "She ___ finished her work already.", options: ["has", "have", "had", "is"], correct: 0, explanation: "She = singular + already = Present Perfect → has" },
    { q: "We ___ visit you tomorrow.", options: ["will", "shall", "are", "have"], correct: 0, explanation: "Tomorrow = Future Simple → will" },
    { q: "I ___ waiting since 3 PM.", options: ["am", "have been", "was", "had"], correct: 1, explanation: "Since 3 PM = duration from past till now → Present Perfect Continuous" },
    { q: "He ___ before I arrived.", options: ["left", "had left", "has left", "leaves"], correct: 1, explanation: "Before I arrived = past before past → Past Perfect: had left" },
    { q: "She ___ a letter at 8 PM yesterday.", options: ["writes", "wrote", "was writing", "has written"], correct: 2, explanation: "At 8 PM yesterday = specific time in past → Past Continuous" },
    { q: "By 2030, they ___ the project.", options: ["finish", "finished", "will finish", "will have finished"], correct: 3, explanation: "By 2030 = completed action in future → Future Perfect" },
    { q: "'News' is a/an ___ noun.", options: ["Countable", "Uncountable", "Proper", "Collective"], correct: 1, explanation: "News = uncountable (no plural form: not 'newses')" },
    { q: "Which is a modal verb?", options: ["run", "eat", "can", "go"], correct: 2, explanation: "Can = modal verb (shows ability). Run, eat, go = action verbs." },
    { q: "'Quickly' is an adverb of ___.", options: ["Time", "Place", "Manner", "Degree"], correct: 2, explanation: "Quickly = describes HOW an action is done → Adverb of Manner" },
    { q: "Active: He writes a letter. Passive: A letter ___ by him.", options: ["is written", "was written", "writes", "written"], correct: 0, explanation: "Present Simple Passive: is/am/are + V3 → is written" },
    { q: "He said, 'I am tired.' Indirect: He said that he ___ tired.", options: ["is", "was", "has been", "will be"], correct: 1, explanation: "Direct Present → Indirect Past. Am → was" },
    { q: "'Since' is used with ___.", options: ["duration", "point in time", "future", "past simple"], correct: 1, explanation: "Since = point in time (e.g., since Monday, since 2 PM). For = duration." },
    { q: "The cat ___ on the mat right now.", options: ["sleep", "sleeps", "is sleeping", "slept"], correct: 2, explanation: "Right now = Present Continuous → is sleeping" },
    { q: "I ___ never ___ such a beautiful place.", options: ["have...seen", "had...seen", "am...seeing", "will...see"], correct: 0, explanation: "Never + experience = Present Perfect → have seen" },
    { q: "If it rains, I ___ at home.", options: ["stay", "will stay", "stayed", "would stay"], correct: 1, explanation: "First conditional: If + Present Simple, will + V1" },
    { q: "She is ___ than her sister.", options: ["tall", "taller", "tallest", "more tall"], correct: 1, explanation: "Than = comparative form → taller (not more tall)" },
    { q: "___ you like some tea?", options: ["Do", "Would", "Are", "Did"], correct: 1, explanation: "Polite offer → Would you like...? (fixed expression)" }
];

// ============================================
// SENTENCE SCRAMBLE DATA (10 Sentences)
// ============================================
const ScrambleData = [
    { sentence: "I eat an apple every day", hint: "Present Simple — Daily Habit" },
    { sentence: "She is playing cricket now", hint: "Present Continuous — Right Now" },
    { sentence: "They went to school yesterday", hint: "Past Simple — Completed Action" },
    { sentence: "He has finished his homework", hint: "Present Perfect — Just Completed" },
    { sentence: "We will go to Lahore tomorrow", hint: "Future Simple — Future Plan" },
    { sentence: "She was reading a book at 8 PM", hint: "Past Continuous — Specific Time in Past" },
    { sentence: "I had eaten before he came", hint: "Past Perfect — Past Before Past" },
    { sentence: "They will be working late tonight", hint: "Future Continuous — Ongoing Future" },
    { sentence: "A letter was written by him", hint: "Passive Voice — Past Simple Passive" },
    { sentence: "He said that he was tired", hint: "Indirect Speech — Past Reporting Verb" }
];

// ============================================
// DAILY CHALLENGES
// ============================================
const DailyChallenges = [
    "Translate: 'Main kal jaunga' to Future Simple.",
    "Change to Passive: 'She cooks food every day'.",
    "Identify Noun type: 'Karachi is a big city'.",
    "Correct the error: 'He go to school daily'.",
    "Convert to Indirect: 'I am busy', he said.",
    "Make comparative: 'This book is good'.",
    "Use 'since' in a sentence about your studies.",
    "Identify the adverb: 'She sings beautifully'."
];


// ============================================
// UTILITY FUNCTIONS
// ============================================

function $(selector) { return document.querySelector(selector); }
function $$(selector) { return document.querySelectorAll(selector); }

function vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// ============================================
// THEME & LANGUAGE MANAGEMENT
// ============================================

function initThemeAndLanguage() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedLang = localStorage.getItem('lang') || 'roman';
    const savedFontSize = localStorage.getItem('fontSize') || '16';

    DOM.body.setAttribute('data-theme', savedTheme);
    document.documentElement.style.setProperty('--font-size', savedFontSize + 'px');
    State.currentFontSize = parseInt(savedFontSize);

    setLanguage(savedLang);
    updateThemeIcon(savedTheme);
}

DOM.themeToggle?.addEventListener('click', () => {
    const currentTheme = DOM.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    DOM.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    syncURLState();

    // Night Owl Badge
    if (newTheme === 'dark') {
        let nightCount = parseInt(localStorage.getItem('nightCount') || '0');
        nightCount++;
        localStorage.setItem('nightCount', nightCount);
        if (nightCount >= CONSTANTS.NIGHT_COUNT_BADGE) checkBadges('night_owl');
    }
});

DOM.langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        setLanguage(lang);
        syncURLState();
    });
});

function setLanguage(lang) {
    localStorage.setItem('lang', lang);
    DOM.langBtns.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });

    const targets = document.querySelectorAll('[data-urdu]:not(.formula):not(.en)');

    if (lang === 'urdu') {
        document.body.setAttribute('dir', 'rtl');
        targets.forEach(el => {
            if (!el.getAttribute('data-roman')) {
                el.setAttribute('data-roman', el.innerText);
            }
            el.innerText = el.getAttribute('data-urdu');
        });
    } else {
        document.body.removeAttribute('dir');
        targets.forEach(el => {
            const roman = el.getAttribute('data-roman');
            if (roman) el.innerText = roman;
        });
    }
}

function updateThemeIcon(theme) {
    const icon = DOM.themeToggle?.querySelector('i');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// ============================================
// FONT SIZE MANAGEMENT
// ============================================

DOM.fontIncrease?.addEventListener('click', () => {
    if (State.currentFontSize < CONSTANTS.MAX_FONT_SIZE) {
        State.currentFontSize += CONSTANTS.FONT_STEP;
        document.documentElement.style.setProperty('--font-size', State.currentFontSize + 'px');
        localStorage.setItem('fontSize', State.currentFontSize);
        showToast(`Font size: ${State.currentFontSize}px`, 'info');
    }
});

DOM.fontDecrease?.addEventListener('click', () => {
    if (State.currentFontSize > CONSTANTS.MIN_FONT_SIZE) {
        State.currentFontSize -= CONSTANTS.FONT_STEP;
        document.documentElement.style.setProperty('--font-size', State.currentFontSize + 'px');
        localStorage.setItem('fontSize', State.currentFontSize);
        showToast(`Font size: ${State.currentFontSize}px`, 'info');
    }
});

// ============================================
// SCROLL & NAVIGATION
// ============================================

function handleScroll() {
    const winScroll = window.scrollY;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    if (DOM.progress) DOM.progress.style.width = scrolled + '%';

    DOM.backToTop?.classList.toggle('visible', winScroll > 300);

    let current = '';
    DOM.sections.forEach(section => {
        if (winScroll >= section.offsetTop - 150) {
            current = section.getAttribute('id');
        }
    });

    DOM.navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}

window.addEventListener('scroll', throttle(handleScroll, 100));

DOM.backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// ACCORDION FUNCTIONALITY
// ============================================

function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(button => {
        button.addEventListener('click', () => {
            const accordion = button.parentElement;
            const isActive = accordion.classList.contains('active');

            accordion.parentElement?.querySelectorAll('.accordion').forEach(acc => {
                acc.classList.remove('active');
            });

            if (!isActive) accordion.classList.add('active');
        });
    });
}

// Keyboard Navigation for Accordions
document.querySelectorAll('.accordion-header').forEach((header, index, headers) => {
    header.setAttribute('tabindex', '0');
    header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            header.click();
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            headers[index + 1]?.focus();
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            headers[index - 1]?.focus();
        }
    });
});

// ============================================
// TIMELINE INTERACTIVITY
// ============================================

function initTimeline() {
    document.querySelectorAll('.timeline-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const tense = dot.getAttribute('data-tense');
            if (tense) openTenseAccordion(tense);
        });

        dot.addEventListener('mouseenter', () => {
            vibrate(20);
        });
    });
}

function openTenseAccordion(tenseGroup) {
    // Find first accordion matching the tense group (e.g., 'past' matches 'past-simple')
    const accordion = document.querySelector(`[data-tense^="${tenseGroup}-"]`);
    if (!accordion) return;

    document.querySelectorAll('.accordion').forEach(acc => acc.classList.remove('active'));
    accordion.classList.add('active');
    accordion.scrollIntoView({ behavior: 'smooth', block: 'center' });
    accordion.classList.add('timeline-target');
    setTimeout(() => accordion.classList.remove('timeline-target'), 2000);
    vibrate(30);
}

// ============================================
// SKELETON LOADING
// ============================================

function initSkeleton() {
    document.querySelectorAll('.card, .section-header, .table-wrapper').forEach(el => {
        el.classList.add('skeleton');
    });
    setTimeout(() => {
        document.querySelectorAll('.skeleton').forEach(el => el.classList.remove('skeleton'));
    }, 800);
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            entry.target.style.opacity = '1';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

function initAnimations() {
    document.querySelectorAll('.card, .accordion').forEach(el => {
        el.style.opacity = '0';
        scrollObserver.observe(el);
    });
}

// ============================================
// SEARCH WITH HIGHLIGHT
// ============================================

function initSearch() {
    if (!DOM.searchInput) return;

    const debouncedSearch = debounce((term) => performSearch(term), 200);

    DOM.searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        debouncedSearch(term);
    });
}

function performSearch(term) {
    let foundCount = 0;
    const allCards = document.querySelectorAll('.card, .accordion');

    clearHighlights();

    if (term === '') {
        allCards.forEach(card => card.classList.remove('hidden'));
        DOM.sections.forEach(section => section.classList.remove('hidden'));
        DOM.emptyState?.classList.add('hidden');
        return;
    }

    allCards.forEach(card => {
        const text = card.innerText.toLowerCase();
        const hasMatch = text.includes(term);

        card.classList.toggle('hidden', !hasMatch);

        if (hasMatch) {
            foundCount++;
            if (term.length >= 2) {
                highlightTextInElement(card, term);
            }
        }
    });

    DOM.sections.forEach(section => {
        const visibleCards = section.querySelectorAll('.card:not(.hidden), .accordion:not(.hidden)');
        section.classList.toggle('hidden', visibleCards.length === 0);
    });

    DOM.emptyState?.classList.toggle('hidden', foundCount > 0);
    updateSearchInfo(foundCount, term);
    syncURLState();
}

function clearHighlights() {
    document.querySelectorAll('mark.highlight').forEach(m => {
        const parent = m.parentNode;
        if (parent) {
            parent.replaceChild(document.createTextNode(m.textContent), m);
            parent.normalize();
        }
    });
}

function highlightTextInElement(element, term) {
    const safeTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${safeTerm})`, 'gi');

    const textNodes = getTextNodes(element);
    textNodes.forEach(node => {
        if (node.parentElement?.closest('.formula, .en')) return;
        if (regex.test(node.textContent)) {
            const span = document.createElement('span');
            span.innerHTML = node.textContent.replace(regex, '<mark class="highlight">$1</mark>');
            node.parentNode.replaceChild(span, node);
        }
    });
}

function getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walker.nextNode()) {
        if (node.textContent.trim()) textNodes.push(node);
    }
    return textNodes;
}

function updateSearchInfo(count, term) {
    let infoEl = document.getElementById('searchInfo');
    if (!infoEl) {
        infoEl = document.createElement('div');
        infoEl.id = 'searchInfo';
        infoEl.className = 'search-info';
        DOM.searchInput?.parentElement?.appendChild(infoEl);
    }
    infoEl.innerHTML = count > 0 
        ? `<span class="search-count">${count}</span> results for "${term}"`
        : '';
    infoEl.style.display = count > 0 ? 'block' : 'none';
}

// ============================================
// UTILITY ACTIONS
// ============================================

function copy(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast("Copied to clipboard! 📋", "success");
        vibrate(50);
    }).catch(() => {
        showToast("Copy failed! Try manually.", "warning");
    });
}

function speak(text) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = document.getElementById('slowAudio')?.checked ? 0.5 : 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
    vibrate(30);
}

// ============================================
// FAVORITES SYSTEM
// ============================================

function toggleFav(id) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.indexOf(id);
    const btn = document.querySelector(`#${id} .fav-btn`);

    if (index === -1) {
        favorites.push(id);
        btn?.classList.add('active');
        showToast("Added to favorites ❤️", "success");
        vibrate([30, 50, 30]);
    } else {
        favorites.splice(index, 1);
        btn?.classList.remove('active');
        showToast("Removed from favorites", "info");
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function initFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites.forEach(id => {
        document.querySelector(`#${id} .fav-btn`)?.classList.add('active');
    });
}


// ============================================
// FLASHCARDS SYSTEM (5 Decks)
// ============================================

function initFlashcards() {
    if (!DOM.flashcardEl) return;

    const deckSelector = document.getElementById('deckSelector');
    if (deckSelector) {
        deckSelector.addEventListener('change', (e) => changeDeck(e.target.value));
    }

    DOM.flashcardEl.addEventListener('click', () => {
        vibrate(50);
        DOM.flashcardEl.querySelector('.flashcard')?.classList.toggle('flipped');
    });

    let touchStartX = 0;
    DOM.flashcardEl.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    DOM.flashcardEl.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;

        if (Math.abs(diff) > CONSTANTS.SWIPE_THRESHOLD) {
            if (diff < 0) nextCard();
            else prevCard();
        }
    }, { passive: true });

    document.getElementById('nextCard')?.addEventListener('click', (e) => {
        e.stopPropagation();
        nextCard();
    });

    document.getElementById('prevCard')?.addEventListener('click', (e) => {
        e.stopPropagation();
        prevCard();
    });

    document.getElementById('shuffleDeck')?.addEventListener('click', (e) => {
        e.stopPropagation();
        shuffleCurrentDeck();
    });

    updateCard();
    updateDeckCounter();
}

function changeDeck(deckKey) {
    if (!FlashcardDecks[deckKey]) return;

    State.currentDeck = deckKey;
    State.currentCardInDeck = 0;

    const deckName = FlashcardDecks[deckKey].name;
    showToast(`Switched to ${deckName}`, 'info');
    vibrate(40);

    updateCard();
    updateDeckCounter();
}

function getCurrentDeck() {
    return FlashcardDecks[State.currentDeck]?.cards || FlashcardDecks.all.cards;
}

function nextCard() {
    vibrate(20);
    const deck = getCurrentDeck();
    State.currentCardInDeck = (State.currentCardInDeck + 1) % deck.length;
    updateCard();
}

function prevCard() {
    vibrate(20);
    const deck = getCurrentDeck();
    State.currentCardInDeck = (State.currentCardInDeck - 1 + deck.length) % deck.length;
    updateCard();
}

function updateCard() {
    const deck = getCurrentDeck();
    const card = deck[State.currentCardInDeck];

    if (!card) return;

    const frontEl = document.getElementById('cardFrontText');
    const backEl = document.getElementById('cardBackText');
    const flashcardInner = DOM.flashcardEl?.querySelector('.flashcard');

    if (frontEl) frontEl.innerText = card.front;
    if (backEl) backEl.innerText = card.back;
    flashcardInner?.classList.remove('flipped');

    updateDeckCounter();
}

function updateDeckCounter() {
    const deck = getCurrentDeck();
    const counterEl = document.getElementById('cardCounter');
    if (counterEl) {
        counterEl.innerText = `${State.currentCardInDeck + 1}/${deck.length}`;
    }
}

function shuffleCurrentDeck() {
    const deck = getCurrentDeck();
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    State.currentCardInDeck = 0;
    updateCard();
    showToast("Deck shuffled! 🔀", "success");
    vibrate([20, 30, 20]);
}

// ============================================
// QUIZ SYSTEM (20 Questions)
// ============================================

function initQuiz() {
    document.getElementById('startQuizBtn')?.addEventListener('click', startQuiz);
    document.getElementById('resetQuizBtn')?.addEventListener('click', resetQuiz);
}

function startQuiz() {
    document.getElementById('quizStart')?.classList.add('hidden');
    document.getElementById('quizBox')?.classList.remove('hidden');
    document.getElementById('quizResult')?.classList.add('hidden');

    State.currentQuizIdx = 0;
    State.score = 0;

    loadQuestion();
    updateQuizProgress();
}

function loadQuestion() {
    const q = QuizData[State.currentQuizIdx];
    const questionEl = document.getElementById('quizQuestion');
    const progressEl = document.getElementById('quizProgress');
    const optionsBox = document.getElementById('quizOptions');

    if (questionEl) questionEl.innerHTML = `<span class="q-number">${State.currentQuizIdx + 1}.</span> ${q.q}`;
    if (progressEl) progressEl.innerText = `Question ${State.currentQuizIdx + 1}/${QuizData.length}`;

    if (optionsBox) {
        optionsBox.innerHTML = '';
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.innerHTML = `<span class="opt-letter">${String.fromCharCode(65 + idx)}</span> ${opt}`;
            btn.onclick = () => checkAnswer(idx, btn);
            optionsBox.appendChild(btn);
        });
    }

    updateQuizProgress();
}

function updateQuizProgress() {
    const progressBar = document.getElementById('quizProgressBar');
    if (progressBar) {
        const pct = ((State.currentQuizIdx) / QuizData.length) * 100;
        progressBar.style.width = `${pct}%`;
    }

    const scoreEl = document.getElementById('quizScore');
    if (scoreEl) scoreEl.innerText = `Score: ${State.score}`;
}

function checkAnswer(idx, btnElement) {
    const q = QuizData[State.currentQuizIdx];
    const isCorrect = idx === q.correct;
    const allOptions = document.querySelectorAll('.quiz-option');

    allOptions.forEach(btn => btn.disabled = true);

    if (isCorrect) {
        State.score++;
        btnElement.classList.add('correct');
        btnElement.innerHTML += ' <i class="fas fa-check"></i>';
        addXP(CONSTANTS.XP_PER_QUESTION);
        vibrate(50);
        showToast("Correct! ✅", "success");
    } else {
        btnElement.classList.add('wrong');
        btnElement.innerHTML += ' <i class="fas fa-times"></i>';
        allOptions[q.correct].classList.add('correct');
        vibrate([50, 100, 50]);
        showToast(`Wrong! ${q.explanation}`, "warning");
    }

    updateQuizProgress();

    setTimeout(() => {
        State.currentQuizIdx++;
        if (State.currentQuizIdx < QuizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

function showResults() {
    document.getElementById('quizBox')?.classList.add('hidden');
    const resultEl = document.getElementById('quizResult');
    resultEl?.classList.remove('hidden');

    const percentage = (State.score / QuizData.length) * 100;
    const finalScoreEl = document.getElementById('finalScore');

    let message = '';
    let emoji = '';

    if (percentage === 100) {
        message = "Perfect Score! You're a Grammar Master! 🏆";
        emoji = "🌟";
        addXP(CONSTANTS.XP_PERFECT_BONUS);
        checkBadges('perfect_score');
        launchConfetti();
    } else if (percentage >= 80) {
        message = "Excellent! Almost perfect! 🎉";
        emoji = "🎊";
        launchConfetti();
    } else if (percentage >= 60) {
        message = "Good job! Keep practicing! 💪";
        emoji = "👍";
    } else if (percentage >= 40) {
        message = "Not bad! Review and try again! 📚";
        emoji = "📖";
    } else {
        message = "Keep learning! You'll improve! 🌱";
        emoji = "💪";
    }

    if (finalScoreEl) {
        finalScoreEl.innerHTML = `
            <div class="result-emoji">${emoji}</div>
            <div class="result-score">${State.score}/${QuizData.length}</div>
            <div class="result-percentage">${percentage.toFixed(0)}%</div>
            <div class="result-message">${message}</div>
            <div class="result-details">
                ${percentage >= 70 ? '<div class="badge-earned">🏅 Quiz Champion Badge Earned!</div>' : ''}
            </div>
        `;
    }

    const badgeEarnedEl = document.getElementById('badgeEarned');
    if (badgeEarnedEl) {
        badgeEarnedEl.style.display = percentage >= 70 ? 'block' : 'none';
        if (percentage >= 70) {
            badgeEarnedEl.classList.add('animate');
            vibrate([100, 50, 100, 50, 100]);
        }
    }
}

function resetQuiz() {
    document.getElementById('quizResult')?.classList.add('hidden');
    document.getElementById('quizStart')?.classList.remove('hidden');
    State.score = 0;
    State.currentQuizIdx = 0;

    const progressBar = document.getElementById('quizProgressBar');
    if (progressBar) progressBar.style.width = '0%';
}

// ============================================
// CONFETTI ANIMATION
// ============================================

function launchConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];
    const shapes = ['square', 'rectangle', 'circle', 'tall'];

    for (let i = 0; i < CONSTANTS.CONFETTI_COUNT; i++) {
        const piece = document.createElement('div');
        piece.className = `confetti-piece ${shapes[Math.floor(Math.random() * shapes.length)]}`;
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = Math.random() * 2 + 's';
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';

        const size = Math.random() * 8 + 5;
        piece.style.width = size + 'px';
        piece.style.height = (Math.random() > 0.5 ? size : size * 2) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';

        container.appendChild(piece);
    }

    setTimeout(() => {
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.5s';
        setTimeout(() => container.remove(), 500);
    }, 3500);
}

// ============================================
// SENTENCE SCRAMBLE (10 Sentences)
// ============================================

function initScramble() {
    document.getElementById('checkScramble')?.addEventListener('click', checkScramble);
    document.getElementById('nextScramble')?.addEventListener('click', nextScramble);
    document.getElementById('resetScramble')?.addEventListener('click', resetScramble);

    loadScramble();
}

function loadScramble() {
    const data = ScrambleData[State.currentScrambleIdx];
    const hintEl = document.getElementById('scrambleHint');
    const counterEl = document.getElementById('scrambleCounter');
    const feedbackEl = document.getElementById('scrambleFeedback');

    if (hintEl) hintEl.innerHTML = `<i class="fas fa-lightbulb"></i> ${data.hint}`;
    if (counterEl) counterEl.innerText = `${State.currentScrambleIdx + 1}/${ScrambleData.length}`;
    if (feedbackEl) {
        feedbackEl.innerHTML = '';
        feedbackEl.className = 'scramble-feedback';
    }

    const words = data.sentence.split(' ');
    const shuffled = [...words].sort(() => Math.random() - 0.5);

    const pool = document.getElementById('scramblePool');
    const target = document.getElementById('scrambleTarget');

    if (pool) pool.innerHTML = '';
    if (target) target.innerHTML = '';

    shuffled.forEach((word, i) => {
        const tile = document.createElement('div');
        tile.className = 'word-tile animate';
        tile.innerText = word;
        tile.style.animationDelay = `${i * 0.05}s`;
        tile.onclick = () => moveWord(tile, pool, target);
        pool?.appendChild(tile);
    });
}

function moveWord(tile, from, to) {
    if (!from || !to) return;

    tile.style.transform = 'scale(0.9)';
    setTimeout(() => {
        to.appendChild(tile);
        tile.style.transform = 'scale(1)';
        tile.onclick = () => moveWord(tile, to, from);
    }, 100);

    vibrate(15);
}

function checkScramble() {
    const target = document.getElementById('scrambleTarget');
    const feedbackEl = document.getElementById('scrambleFeedback');

    if (!target || !feedbackEl) return;

    const targetWords = Array.from(target.children).map(c => c.innerText).join(' ');
    const correctSentence = ScrambleData[State.currentScrambleIdx].sentence;

    if (targetWords === correctSentence) {
        feedbackEl.innerHTML = '<i class="fas fa-check-circle"></i> 🎉 Sahi Jawab! Perfect!';
        feedbackEl.className = 'scramble-feedback correct';
        addXP(CONSTANTS.XP_SCRAMBLE);
        vibrate([50, 30, 50]);

        target.querySelectorAll('.word-tile').forEach(tile => {
            tile.classList.add('correct-tile');
        });

        setTimeout(nextScramble, 1500);
    } else {
        feedbackEl.innerHTML = '<i class="fas fa-times-circle"></i> ❌ Dubara koshish karein! Words drag karke sahi order mein lagayein.';
        feedbackEl.className = 'scramble-feedback wrong';
        vibrate([50, 100, 50]);

        target.classList.add('shake');
        setTimeout(() => target.classList.remove('shake'), 500);
    }
}

function nextScramble() {
    State.currentScrambleIdx = (State.currentScrambleIdx + 1) % ScrambleData.length;
    loadScramble();
}

function resetScramble() {
    loadScramble();
    showToast("Scramble reset! 🔄", "info");
}


// ============================================
// GAMIFICATION SYSTEM
// ============================================

function addXP(amount) {
    let xp = parseInt(localStorage.getItem('xp') || '0');
    xp += amount;
    localStorage.setItem('xp', xp);

    if (xp >= CONSTANTS.SCHOLAR_XP) checkBadges('scholar');

    calculateLevel(xp);
    updateStats();
    showToast(`+${amount} XP!`, 'success');
}

function updateStats() {
    const xpEl = document.getElementById('xpCount');
    const streakEl = document.getElementById('streakCount');
    const badgeEl = document.getElementById('badgeCount');

    if (xpEl) xpEl.innerText = localStorage.getItem('xp') || '0';
    if (streakEl) streakEl.innerText = localStorage.getItem('streak') || '0';

    if (badgeEl) {
        const badges = JSON.parse(localStorage.getItem('badges') || '[]');
        badgeEl.innerText = badges.length;
    }
}

function checkStreak() {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('lastVisit');
    let streak = parseInt(localStorage.getItem('streak') || '0');

    if (lastVisit === today) return;

    if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const diffDays = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            streak++;
            if (streak >= CONSTANTS.STREAK_BADGE_DAYS) checkBadges('streak');
            showToast(`🔥 ${streak} day streak!`, 'success');
        } else if (diffDays > 1) {
            streak = 1;
            showToast('Streak reset! Start fresh today! 🌱', 'info');
        }
    } else {
        streak = 1;
    }

    localStorage.setItem('streak', streak);
    localStorage.setItem('lastVisit', today);
    updateStats();
}

function checkBadges(type) {
    let badges = JSON.parse(localStorage.getItem('badges') || '[]');
    let badgeName = '';

    const badgeMap = {
        'perfect_score': 'Perfect Score',
        'night_owl': 'Night Owl',
        'scholar': 'Scholar',
        'streak': 'Streak Master'
    };

    badgeName = badgeMap[type];

    if (badgeName && !badges.includes(badgeName)) {
        badges.push(badgeName);
        localStorage.setItem('badges', JSON.stringify(badges));
        showToast(`🏅 Badge Unlocked: ${badgeName}!`, 'success');
        vibrate([100, 50, 100, 50, 100]);
        updateStats();
    }
}

function calculateLevel(xp) {
    const levelIdx = Math.min(Math.floor(xp / CONSTANTS.LEVEL_XP_STEP), LEVELS.length - 1);
    const levelName = LEVELS[levelIdx];
    const levelEl = document.getElementById('userLevel');

    if (levelEl && levelEl.innerText !== levelName) {
        showToast(`Level Up! You are now a ${levelName}! 🏆`, 'success');
        levelEl.classList.add('level-up');
        setTimeout(() => levelEl.classList.remove('level-up'), 2000);
        levelEl.innerText = levelName;
    }
}

// ============================================
// NOTES SYSTEM
// ============================================

function initNotes() {
    document.querySelectorAll('.notes-area').forEach(textarea => {
        const id = textarea.id;
        const savedNote = localStorage.getItem(id);
        if (savedNote) textarea.value = savedNote;

        textarea.addEventListener('input', debounce(() => {
            localStorage.setItem(id, textarea.value);
        }, 500));
    });
}

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================

function showToast(message, type = 'success') {
    if (!DOM.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'check-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle',
        error: 'times-circle'
    };

    toast.innerHTML = `<i class="fas fa-${icons[type] || icons.info}"></i> <span>${message}</span>`;

    DOM.toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    });

    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, CONSTANTS.TOAST_DURATION);
}

// ============================================
// MODAL SYSTEM
// ============================================

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
        if (id === 'badgeModal') renderBadges();
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

DOM.badgeBtn?.addEventListener('click', () => openModal('badgeModal'));

function renderBadges() {
    let badges = JSON.parse(localStorage.getItem('badges') || '[]');
    const xp = parseInt(localStorage.getItem('xp') || '0');
    const streak = parseInt(localStorage.getItem('streak') || '0');

    if (xp >= CONSTANTS.SCHOLAR_XP && !badges.includes('Scholar')) badges.push('Scholar');
    if (streak >= CONSTANTS.STREAK_BADGE_DAYS && !badges.includes('Streak Master')) badges.push('Streak Master');

    localStorage.setItem('badges', JSON.stringify(badges));

    badges.forEach(b => {
        const id = 'badge-' + b.toLowerCase().replace(/\s+/g, '-');
        document.getElementById(id)?.classList.add('earned');
    });

    updateStats();
}

// ============================================
// VERB TABLE SEARCH
// ============================================

function initVerbSearch() {
    const verbSearch = document.getElementById('verbSearch');
    if (!verbSearch) return;

    verbSearch.addEventListener('input', debounce((e) => {
        const term = e.target.value.toLowerCase().trim();
        const rows = document.querySelectorAll('#verbTable tbody tr');

        rows.forEach(row => {
            const text = row.innerText.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
    }, 200));
}

// ============================================
// DAILY CHALLENGE
// ============================================

function initDailyChallenge() {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const challenge = DailyChallenges[dayOfYear % DailyChallenges.length];
    const el = document.getElementById('challengeText');

    if (el) el.innerText = challenge;

    const lastChallenge = localStorage.getItem('lastChallengeDate');
    if (lastChallenge === new Date().toDateString()) {
        document.getElementById('dailyChallenge')?.classList.add('completed');
    }
}

function solveChallenge() {
    const today = new Date().toDateString();
    const lastChallenge = localStorage.getItem('lastChallengeDate');

    if (lastChallenge === today) {
        showToast("Aaj ka challenge aap pehle hi solve kar chuke hain! 🌟", "info");
        return;
    }

    const challengeText = document.getElementById('challengeText')?.innerText;
    showToast(`Zabardast! Challenge solved: "${challengeText}"`, "success");
    addXP(CONSTANTS.XP_CHALLENGE);
    localStorage.setItem('lastChallengeDate', today);
    document.getElementById('dailyChallenge')?.classList.add('completed');
}

// ============================================
// MISTAKES SYSTEM
// ============================================

function markMistake(id) {
    let mistakes = JSON.parse(localStorage.getItem('myMistakes') || '[]');
    const index = mistakes.indexOf(id);
    const card = document.getElementById(id);

    if (index === -1) {
        mistakes.push(id);
        card?.style.setProperty('border-left-width', '8px');
        showToast("Marked! Ab aap is par zyada tawajjo dein.", "warning");
        vibrate([30, 50, 30]);
    } else {
        mistakes.splice(index, 1);
        card?.style.setProperty('border-left-width', '4px');
        showToast("Mistake removed!", "info");
    }
    localStorage.setItem('myMistakes', JSON.stringify(mistakes));
}

function initMistakes() {
    const mistakes = JSON.parse(localStorage.getItem('myMistakes') || '[]');
    mistakes.forEach(id => {
        document.getElementById(id)?.style.setProperty('border-left-width', '8px');
    });
}

// ============================================
// URL STATE SYNC
// ============================================

function syncURLState() {
    const params = new URLSearchParams(window.location.search);
    const theme = DOM.body.getAttribute('data-theme');
    const lang = localStorage.getItem('lang') || 'roman';
    const query = DOM.searchInput?.value || '';

    params.set('theme', theme);
    params.set('lang', lang);
    query ? params.set('q', query) : params.delete('q');

    const newURL = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
    window.history.replaceState({}, '', newURL);
}

function loadURLState() {
    const params = new URLSearchParams(window.location.search);
    const theme = params.get('theme');
    const lang = params.get('lang');
    const q = params.get('q');

    if (theme) {
        DOM.body.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
    }
    if (lang) setLanguage(lang);
    if (q && DOM.searchInput) {
        DOM.searchInput.value = q;
        performSearch(q);
    }
}

// ============================================
// EXPORT / IMPORT DATA
// ============================================

function exportData() {
    const data = {
        xp: localStorage.getItem('xp'),
        streak: localStorage.getItem('streak'),
        favorites: localStorage.getItem('favorites'),
        badges: localStorage.getItem('badges'),
        theme: localStorage.getItem('theme'),
        lang: localStorage.getItem('lang'),
        nightCount: localStorage.getItem('nightCount'),
        notes: {}
    };

    document.querySelectorAll('.notes-area').forEach(ta => {
        data.notes[ta.id] = ta.value;
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `egm_progress_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Progress exported successfully! 💾", "info");
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);

            const keys = ['xp', 'streak', 'favorites', 'badges', 'theme', 'lang', 'nightCount'];
            keys.forEach(key => {
                if (data[key]) localStorage.setItem(key, data[key]);
            });

            if (data.notes) {
                Object.entries(data.notes).forEach(([id, val]) => {
                    localStorage.setItem(id, val);
                    const el = document.getElementById(id);
                    if (el) el.value = val;
                });
            }

            showToast("Progress imported! Refreshing... 🔄", "success");
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            showToast("Invalid data file! ❌", "warning");
        }
    };
    reader.readAsText(file);
}

// ============================================
// NATIVE SHARE / WHATSAPP FALLBACK
// ============================================

function shareOnWhatsApp(title, id) {
    const url = window.location.href.split('#')[0] + '#' + id;
    const text = `Aaj main ne English Grammar Master par "${title}" seekha! Aap bhi try karein: ${url}`;

    if (navigator.share) {
        navigator.share({
            title: 'English Grammar Master',
            text: text,
            url: url
        }).catch(err => console.log('Error sharing', err));
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
    }
}

// ============================================
// WAKE LOCK
// ============================================

const requestWakeLock = async () => {
    try {
        if ('wakeLock' in navigator) {
            State.wakeLock = await navigator.wakeLock.request('screen');
        }
    } catch (err) {
        console.error(`Wake Lock error: ${err.name}, ${err.message}`);
    }
};

document.addEventListener('visibilitychange', () => {
    if (State.wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
    }
});

// ============================================
// PWA & SERVICE WORKER
// ============================================

function initPWA() {
    const installBtn = document.getElementById('installBtn') || createInstallButton();

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        State.deferredPrompt = e;
        installBtn.style.display = 'flex';
        showToast('Install app for offline access! 📲', 'info');
    });

    installBtn.addEventListener('click', async () => {
        if (State.deferredPrompt) {
            State.deferredPrompt.prompt();
            const { outcome } = await State.deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                installBtn.style.display = 'none';
                showToast('App installed! 🎉', 'success');
            }
            State.deferredPrompt = null;
        }
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(reg => {
            if ('sync' in reg) {
                reg.sync.register('sync-progress').catch(() => {});
            }
        });

        navigator.serviceWorker.addEventListener('controllerchange', () => {
            showToast("Naya update aa gaya! Refresh karein. 🔄", "info");
        });
    }
}

function createInstallButton() {
    const btn = document.createElement('button');
    btn.id = 'installBtn';
    btn.className = 'install-btn';
    btn.innerHTML = '<i class="fas fa-download"></i> Install App';
    btn.style.cssText = 'display:none;position:fixed;bottom:80px;right:20px;z-index:9999;';
    document.body.appendChild(btn);
    return btn;
}

// ============================================
// GRAMMAR TIP OF THE DAY
// ============================================

function showRandomTip() {
    const header = document.querySelector('header');
    if (!header) return;

    header.querySelector('.tip-box')?.remove();

    const tipEl = document.createElement('div');
    tipEl.className = 'tip-box animate';
    tipEl.innerHTML = `
        <i class="fas fa-lightbulb"></i>
        <span>${GRAMMAR_TIPS[Math.floor(Math.random() * GRAMMAR_TIPS.length)]}</span>
    `;

    const nav = header.querySelector('nav');
    if (nav) {
        nav.insertAdjacentElement('afterend', tipEl);
    } else {
        header.appendChild(tipEl);
    }
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            DOM.searchInput?.focus();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            DOM.themeToggle?.click();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            const currentLang = localStorage.getItem('lang') || 'roman';
            setLanguage(currentLang === 'roman' ? 'urdu' : 'roman');
        }
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// ============================================
// SPLASH SCREEN
// ============================================

function initSplashScreen() {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;

    setTimeout(() => {
        splash.style.opacity = '0';
        splash.style.transition = 'opacity 0.5s ease';
        setTimeout(() => splash.remove(), 500);
    }, CONSTANTS.SPLASH_DURATION);
}

// ============================================
// STANDALONE MODE DETECTION
// ============================================

function initStandaloneMode() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;

    if (isStandalone) {
        DOM.body.classList.add('app-mode');
        showToast('App Mode Active! 📱', 'success');
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Core Systems
    initThemeAndLanguage();
    initAccordions();
    initSkeleton();
    initAnimations();
    initTimeline();
    initSearch();
    initFlashcards();
    initQuiz();
    initScramble();
    initNotes();
    initVerbSearch();
    initDailyChallenge();
    initMistakes();
    initFavorites();
    initKeyboardShortcuts();
    initPWA();
    initSplashScreen();
    initStandaloneMode();

    // Gamification
    checkStreak();
    updateStats();
    calculateLevel(parseInt(localStorage.getItem('xp') || '0'));

    // UI
    showRandomTip();
    requestWakeLock();
    loadURLState();
});

window.addEventListener('load', () => {
    loadURLState();
    calculateLevel(parseInt(localStorage.getItem('xp') || '0'));
});
