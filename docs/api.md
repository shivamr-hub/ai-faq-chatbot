# SmartSupport AI — API Reference

> This document defines the public interface of each JavaScript module.
> Written **before** implementation — this is intentional.
>
> **Why document first?**  
> When you define what a function *should* do before writing it,
> you catch design problems early. Changing a spec costs nothing.
> Changing working code costs time.

---

## Convention

Functions are documented with:

- **Purpose** — what it does in plain English
- **Parameters** — inputs and their types
- **Returns** — what comes back
- **Example** — concrete usage

---

## `utils.js` — Pure Helper Functions

No dependencies. No side effects. Every function returns a value.

---

### `normalizeText(text)`

Cleans a string for consistent matching.

| | Type | Description |
|---|---|---|
| **Param** | `string` | Raw user input |
| **Returns** | `string` | Lowercase, trimmed, punctuation removed |

```javascript
normalizeText("  What are YOUR hours??  ")
// → "what are your hours"
```

---

### `matchScore(query, target)`

Scores how well a user query matches a FAQ keyword string.

| | Type | Description |
|---|---|---|
| **Param** `query` | `string` | Normalized user input |
| **Param** `target` | `string` | FAQ keywords to match against |
| **Returns** | `number` | Count of matching words (higher = better) |

```javascript
matchScore("what are your business hours", "business hours open close")
// → 2
```

---

### `delay(ms)`

Returns a Promise that resolves after `ms` milliseconds.
Used to simulate realistic bot typing time.

| | Type | Description |
|---|---|---|
| **Param** | `number` | Milliseconds to wait |
| **Returns** | `Promise` | Resolves after the delay |

```javascript
await delay(1200);  // wait 1.2 seconds before bot replies
```

---

### `isEmpty(text)`

Checks whether a string is blank or whitespace-only.

| | Type | Description |
|---|---|---|
| **Param** | `string` | Input to check |
| **Returns** | `boolean` | `true` if blank |

```javascript
isEmpty("   ")  // → true
isEmpty("Hi")   // → false
```

---

### `isValidEmail(email)` / `isValidPhone(phone)`

Validates user-entered contact information during lead capture.

```javascript
isValidEmail("user@gmail.com")  // → true
isValidPhone("9876543210")      // → true
isValidPhone("123")             // → false
```

---

### `getTimestamp()`

Returns the current local time formatted for display.

| | Type | Description |
|---|---|---|
| **Returns** | `string` | e.g. `"9:34 AM"` |

---

### `generateId()`

Returns a short unique string for identifying DOM elements.

| | Type | Description |
|---|---|---|
| **Returns** | `string` | e.g. `"msg_k7f2x"` |

---

## `storage.js` — Persistence Layer

All localStorage access goes through this module.

---

### `saveChatHistory(messages)` / `loadChatHistory()`

Persists the full conversation array across page refreshes.

```javascript
// Save
saveChatHistory([
  { id: "msg_a1b2c", role: "bot",  text: "Hello!",  time: "9:00 AM" },
  { id: "msg_d3e4f", role: "user", text: "Hi there", time: "9:01 AM" }
]);

// Load
const history = loadChatHistory();
// → [ { id, role, text, time }, ... ]
```

---

### `saveTheme(theme)` / `loadTheme()`

Stores and retrieves the active color theme.

```javascript
saveTheme('light');
loadTheme();  // → 'light'
```

---

### `saveLead(lead)`

Saves a captured lead to localStorage.
Appends to any existing leads — never overwrites.

```javascript
saveLead({
  name:  "Priya Sharma",
  email: "priya@gmail.com",
  phone: "9876543210"
});
```

---

### `loadLeads()` / `getLeadCount()`

Retrieves all captured leads. Useful for a future admin view.

```javascript
loadLeads();     // → [ { name, email, phone, capturedAt }, ... ]
getLeadCount();  // → 3
```

---

## `ui.js` — Rendering Layer

The only module that reads from or writes to the DOM.

---

### `renderMessage(message)`

Inserts a chat bubble into `#chat-messages`.

```javascript
renderMessage({
  id:   generateId(),
  role: 'bot',
  text: 'Hello 👋 How can I help you today?',
  time: getTimestamp()
});
```

---

### `showTypingIndicator()` / `hideTypingIndicator()`

Displays and removes the animated "typing..." indicator.

```javascript
showTypingIndicator();
await delay(1200);
hideTypingIndicator();
renderMessage(botReply);
```

---

### `renderSuggestedQuestions(questions, onSelect)`

Renders clickable pill buttons below the chat window.

| | Type | Description |
|---|---|---|
| **Param** `questions` | `string[]` | List of question labels |
| **Param** `onSelect` | `function` | Called with the selected question string |

```javascript
renderSuggestedQuestions(
  ["Business Hours", "Pricing", "Contact"],
  (question) => handleSend(question)
);
```

---

### `disableInput()` / `enableInput()`

Locks/unlocks the chat input during bot reply processing.

---

### `toggleTheme()`

Switches between dark and light mode. Returns the new theme.

```javascript
const newTheme = toggleTheme();
saveTheme(newTheme);
// → 'light'
```

---

## `faq-data.js` — Knowledge Base

> **This is not a function API — it's a data contract.**  
> The shape of `businessKnowledge` must stay consistent
> so `chatbot.js` can rely on it.

```javascript
const businessKnowledge = {

  businessName: "string",

  greetings: ["string"],         // phrases that trigger a greeting

  businessHours: {
    weekdays: "string",          // e.g. "Mon – Fri"
    hours:    "string",          // e.g. "9AM – 6PM"
    weekend:  "string"           // e.g. "Closed"
  },

  services: [
    {
      name:        "string",
      description: "string",
      keywords:    ["string"]    // words that trigger this service
    }
  ],

  faqs: [
    {
      question: "string",        // human-readable question
      keywords: ["string"],      // words used for matching
      answer:   "string"         // the bot's reply
    }
  ],

  pricing: [
    {
      name:     "string",
      price:    "string",
      keywords: ["string"]
    }
  ],

  contact: {
    phone:   "string",
    email:   "string",
    address: "string"
  },

  leadTriggers: ["string"],      // keywords that start lead capture
                                 // e.g. ["quotation", "price", "hire"]

  fallbackReplies: ["string"]    // used when no FAQ matches
};
```

---

## `chatbot.js` — Business Logic Engine

The core reasoning engine. Uses `faq-data`, `utils`, and `storage`.

---

### `SmartSupportBot.reply(userInput)`

Processes a user message and returns a structured reply.

| | Type | Description |
|---|---|---|
| **Param** | `string` | Raw user message |
| **Returns** | `Promise<Object>` | Reply object (see below) |

```javascript
const result = await bot.reply("what are your business hours?");

// result →
{
  text:       "We're open Mon – Fri, 9AM – 6PM.",
  confidence: 0.91,        // 0.0 to 1.0 — how certain the match is
  type:       "faq"        // "faq" | "greeting" | "lead" | "fallback"
}
```

**Confidence scale:**

| Score | Meaning |
|---|---|
| `0.8 – 1.0` | Strong match — answer confidently |
| `0.5 – 0.7` | Partial match — answer with caveat |
| `0.0 – 0.4` | No match — use fallback reply |

---

### `SmartSupportBot.startLeadCapture()`

Begins the multi-step lead collection conversation.
Manages its own internal state (`name → email → phone → saved`).

```javascript
bot.startLeadCapture();
// Bot asks: "May I have your name?"
// ... (conversation continues)
// On completion: storage.saveLead({ name, email, phone })
```

---

## `app.js` — Application Entry Point

Initializes everything. Binds all event listeners.

---

### `init()`

Bootstraps the entire application on page load.

```javascript
// Called automatically on DOMContentLoaded:
function init() {
  applyTheme(loadTheme());           // restore theme preference
  renderChatHistory(loadChatHistory()); // restore conversation
  renderSuggestedQuestions([...]);   // show quick-tap questions
  bindEventListeners();              // attach send button + enter key
}
```

---

### `handleSend(inputText?)`

Orchestrates sending a message end-to-end.
Called when the user clicks Send, presses Enter, or taps a suggestion.

```javascript
async function handleSend(inputText) {
  // 1. Get + validate input
  // 2. Render user message
  // 3. Show typing indicator
  // 4. Get bot reply
  // 5. Hide indicator, render reply
  // 6. Save history
}
```

---

*Last updated: Stage 3 — Business Logic*
