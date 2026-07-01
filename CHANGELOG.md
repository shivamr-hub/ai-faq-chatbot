# Changelog

All notable changes to SmartSupport AI are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
Versioning: [Semantic Versioning](https://semver.org/) — `MAJOR.MINOR.PATCH`

---

## [1.0.0] — 2025-07-01 🎉

**SmartSupport AI v1.0 — First Complete Release**

This release marks the completion of the full product prototype.
The chatbot is deployable, customizable, and ready to demonstrate to clients.

### Added

**JavaScript — Core Engine**
- `js/utils.js` — 9 pure helper functions: `normalizeText`, `matchScore`, `delay`, `isEmpty`, `getTimestamp`, `generateId`, `capitalize`, `isValidEmail`, `isValidPhone`
- `js/storage.js` — localStorage module: chat history, theme preference, lead capture storage
- `js/faq-data.js` — Business knowledge base: 10 FAQs, lead triggers, greetings, fallback replies, suggested questions
- `js/ui.js` — All DOM rendering: `renderMessage`, `renderChatHistory`, `showTypingIndicator`, `hideTypingIndicator`, `renderSuggestedQuestions`, `scrollToBottom`, `disableInput`, `enableInput`, `toggleTheme`, `showStatusMessage`
- `js/chatbot.js` — `SmartSupportBot` class: keyword match engine + 4-state lead capture machine (`IDLE → WAITING_NAME → WAITING_EMAIL → WAITING_PHONE`)
- `js/app.js` — Entry point: `init()`, `handleSend()`, event binding, navbar scroll effect

**CSS — Runtime Styles Added**
- Typing indicator (`typingBounce` animation with staggered dot delays)
- Suggestion pills (`.suggestion-pill` with hover to primary blue)
- Status messages (error, success, info variants)
- Navbar `.scrolled` state (opacity increase on page scroll)

**Documentation**
- `docs/api.md` — Full function reference, documented before implementation
- `docs/setup.md` — Requirements, install, local run, deployment guide, troubleshooting
- `docs/case-study.md` — Problem, solution, architecture, challenges, lessons, business pricing
- `docs/screenshots/` — Placeholder for UI screenshots

### Changed
- `README.md` — Fully rewritten as premium portfolio README with badges, live demo, feature table, architecture, pricing packages, and roadmap
- Script load order in `index.html` updated with full 6-file dependency chain

---

## [0.3.0] — 2025-07-01

### Added
- `<header>` semantic wrapper around `<nav>` and `#hero`
- **How It Works** section (4-step flow)
- `.gitignore`, `CHANGELOG.md`, full `README.md`
- `docs/architecture.md` — module map and data flow

### Changed
- Trust text: "Trusted by 100+ businesses" → "Built for small businesses"
- Section renamed: "Business Information" → "Contact & Business Hours"
- Navbar CTA updated to "Get Started"

---

## [0.2.0] — 2025-07-01

### Added
- Trust Indicators section with ⭐⭐⭐⭐⭐ and 4 checkmarks

### Changed
- Hero subtitle rewritten: feature language → benefit language
- CTA button: "Try Demo" → "Try Live Demo →"

### Removed
- Roadmap section from public HTML

---

## [0.1.0] — 2025-07-01

### Added
- Initial HTML structure: Navbar, Hero, Trust, Features, Demo, Business Info, Footer
- Semantic HTML5: `<header>`, `<nav>`, `<section>`, `<footer>`
- SEO: meta description, title tag
- CSS design system: 9 sections, CSS variables, glassmorphism, animations, media queries
- File structure: `css/`, `js/`, `docs/`, `assets/`
