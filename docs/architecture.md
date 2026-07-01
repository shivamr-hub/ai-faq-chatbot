# SmartSupport AI — Technical Architecture

> This document explains how the codebase is organized and why each file exists.
> Keep this updated as the project grows.

---

## Project Structure

```
faq-chatbot/
│
├── index.html          ← Page structure — all HTML sections
│
├── css/
│   └── style.css       ← Design system — variables, components, sections
│
├── js/
│   ├── utils.js        ← Pure helper functions (no DOM, no side effects)
│   ├── storage.js      ← localStorage: chat history, theme, leads
│   ├── faq-data.js     ← Business knowledge base (FAQs, contact, hours)
│   ├── ui.js           ← All DOM rendering and UI interactions
│   ├── chatbot.js      ← Chatbot engine — matching, lead capture, replies
│   └── app.js          ← Entry point — initializes app, binds events
│
├── assets/             ← Images, icons, screenshots
│
├── docs/               ← Technical documentation
│   ├── architecture.md ← This file
│   ├── deployment.md   ← How to deploy to GitHub Pages / Netlify
│   └── screenshots/    ← UI screenshots for README
│
├── README.md           ← Portfolio-facing project overview
├── CHANGELOG.md        ← Version history
├── LICENSE             ← MIT License
└── .gitignore          ← Excluded from Git
```

---

## Module Dependency Map

```
app.js
  ├── uses → ui.js       (render messages, toggle theme)
  ├── uses → chatbot.js  (get bot replies)
  ├── uses → storage.js  (save/load history and theme)
  └── uses → utils.js    (isEmpty, getTimestamp)

chatbot.js
  ├── uses → faq-data.js  (knowledge base)
  ├── uses → utils.js     (normalizeText, matchScore, delay)
  └── uses → storage.js   (saveLead)

ui.js
  └── uses → utils.js     (getTimestamp, generateId)

storage.js
  └── (no dependencies — pure localStorage wrapper)

utils.js
  └── (no dependencies — pure functions only)
```

**Rule:** Dependencies only flow downward.  
`app.js` can use anything. `utils.js` uses nothing.  
This prevents circular dependencies.

---

## Data Flow: User Sends a Message

```
1. User types in #chat-input and clicks Send

2. app.js — handleSend()
   ├── Gets input value from ui.getInputValue()
   ├── Validates it with utils.isEmpty()
   ├── Creates a user message object
   ├── Calls ui.renderMessage(userMessage)
   ├── Calls ui.disableInput()
   ├── Calls ui.showTypingIndicator()
   └── Calls chatbot.reply(userInput)

3. chatbot.js — reply()
   ├── Normalizes text with utils.normalizeText()
   ├── Searches faq-data.businessKnowledge.faqs
   ├── Scores each FAQ with utils.matchScore()
   ├── Waits utils.delay(1200ms) — realistic typing feel
   └── Returns best matching answer (or fallback)

4. app.js — receives reply
   ├── Calls ui.hideTypingIndicator()
   ├── Creates a bot message object
   ├── Calls ui.renderMessage(botMessage)
   ├── Calls storage.saveChatHistory(allMessages)
   └── Calls ui.enableInput()
```

---

## Lead Capture Flow

```
User: "I want a quotation"
  ↓
chatbot.js detects lead trigger keyword
  ↓
Bot asks: "May I have your name?"
  ↓ (user replies)
Bot asks: "What's your email address?"
  ↓ (user replies, validated with utils.isValidEmail)
Bot asks: "And your phone number?"
  ↓ (user replies, validated with utils.isValidPhone)
Bot: "Thank you! We'll contact you shortly."
  ↓
storage.saveLead({ name, email, phone, capturedAt })
```

---

## CSS Design System

See `css/style.css` — organized in 9 sections:

1. CSS Reset
2. CSS Variables (all design tokens)
3. Global Styles
4. Typography
5. Layout
6. Components (buttons, cards, badges)
7. Sections (navbar, hero, features, chat, etc.)
8. Animations
9. Media Queries

**Key principle:** Every value comes from a CSS variable in `:root`.  
No hardcoded colors, spacing, or font sizes outside of section 2.

---

## Planned Features (v2)

| Feature              | File(s) affected       | Status  |
| -------------------- | ---------------------- | ------- |
| Typing indicator     | ui.js, style.css       | ✅ Ready |
| Suggested questions  | ui.js, app.js          | ✅ Ready |
| Theme toggle         | ui.js, storage.js      | ✅ Ready |
| Chat history persist | storage.js, app.js     | ✅ Ready |
| Lead capture flow    | chatbot.js, storage.js | ⏳ Stage 3 |
| Auto-suggestions     | ui.js, faq-data.js     | ⏳ Stage 3 |
| OpenAI API           | chatbot.js             | ⏳ Future |
| Admin dashboard      | New: admin.html        | ⏳ Future |
| CSV export           | storage.js             | ⏳ Future |

---

## Deployment

See `docs/deployment.md` for full instructions.

**Quick summary:**
- GitHub Pages: push to `main`, enable Pages in repo settings
- Netlify: drag and drop the project folder
- No build step required — pure HTML/CSS/JS
