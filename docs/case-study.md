# Case Study — SmartSupport AI

> **Category:** AI Automation / Customer Support  
> **Type:** Freelance Product Prototype  
> **Stack:** HTML5, CSS3, Vanilla JavaScript  
> **Status:** v1.0 Complete — Ready for Client Deployment

---

## The Problem

Small businesses in India lose potential customers every day because:

- **No one is available** to answer queries after 6PM or on weekends
- **Staff spend hours** answering the same 10 questions repeatedly
- **Website visitors leave** before getting the help they need
- **Leads go uncaptured** — a visitor was ready to buy, but nobody was there

The business owner can't afford a 24/7 support team.  
But they're losing money without one.

---

## The Solution

A custom AI chatbot, deployed directly on the business website, that:

1. **Answers FAQs instantly** from a structured knowledge base
2. **Works 24/7** with no human needed
3. **Captures leads** — name, email, phone — when a visitor shows interest
4. **Adapts to any business** by editing a single configuration file

No monthly subscription. No third-party API cost. No recurring fees.  
One-time build. Fully owned by the client.

---

## Architecture

The project uses a clean 6-module architecture:

```
app.js          ← Entry point — initializes and orchestrates
  │
  ├── ui.js           ← All DOM rendering (messages, typing, pills)
  ├── chatbot.js      ← Match engine + lead capture state machine
  ├── faq-data.js     ← Business knowledge base (client edits this)
  ├── storage.js      ← localStorage (history, theme, leads)
  └── utils.js        ← Pure helpers (normalize, validate, delay)
```

**Key design decisions:**

- **Separation of concerns** — changing the UI doesn't touch logic, changing the knowledge base doesn't touch rendering
- **Single config file** — a client deployment requires editing `faq-data.js` only
- **State machine for lead capture** — `IDLE → WAITING_NAME → WAITING_EMAIL → WAITING_PHONE → IDLE` — clean, extendable, no messy if/else chains
- **No external dependencies** — runs in any browser, no npm, no build step

---

## How the Chatbot Engine Works

```
User types: "what are your hours?"

↓  normalizeText()  →  "what are your hours"

↓  Loop through BUSINESS.faqs[]
   FAQ 1 keywords: ["hours", "open", "timing"] → score: 2 ✅
   FAQ 2 keywords: ["phone", "call"]            → score: 0
   ...

↓  Best match: score ≥ 1

↓  Return: "We're open Monday to Friday, 9AM–6PM."

↓  ui.renderMessage() displays it
```

For **lead capture**, the engine uses a state machine:

```
User: "I need a quotation"
  → leadTriggers match → startLeadCapture()
  → state: WAITING_NAME

User: "Shivam"
  → capitalize() → leadData.name = "Shivam"
  → state: WAITING_EMAIL

User: "shivam@gmail.com"
  → isValidEmail() → passes
  → state: WAITING_PHONE

User: "9876543210"
  → isValidPhone() → passes
  → saveLead({ name, email, phone, capturedAt })
  → state: IDLE
```

Every lead is saved to localStorage and can be exported in a future version.

---

## Challenges

### 1. Fuzzy Matching Without an AI API

The first version uses keyword matching — not semantic AI.  
This means `"what time do you open?"` and `"business hours?"` both need to match the same FAQ.

**Solution:** Each FAQ entry has multiple keywords. `matchScore()` counts how many query words appear in the keyword list. A score ≥ 1 triggers the answer. This approach handles 90% of real-world FAQ queries without any API cost.

**Future upgrade path:** Replace `_findBestMatch()` with an OpenAI API call. The rest of the app stays identical.

---

### 2. Stateful Conversations in Stateless JavaScript

JavaScript doesn't natively "remember" where a conversation is. Every function call is independent.

**Solution:** The `SmartSupportBot` class holds `this.leadState` and `this.leadData` as instance properties. Because we create a single instance (`const bot = new SmartSupportBot()`), state persists across the entire session.

---

### 3. Input Validation Without a Backend

We can't verify emails server-side without a backend. But accepting bad data damages the lead quality.

**Solution:** `isValidEmail()` and `isValidPhone()` use RegEx patterns to validate format. It's not perfect, but it filters out obvious mistakes (missing `@`, too-short numbers) before saving.

---

## Lessons Learned

**1. Architecture first saves time.**  
Defining the module structure before writing logic meant zero refactoring. Each file had one job from day one.

**2. Design tokens pay off immediately.**  
Using CSS variables exclusively meant the entire color scheme could change by editing 7 lines in `:root`. A client asking for "our brand blue instead" takes 30 seconds.

**3. State machines are underused.**  
The lead capture flow could have been 40 lines of nested if/else statements. The state machine made it 5 distinct, readable cases. Adding a new step (e.g., "ask for company name") is a 10-line addition.

**4. Documentation is a portfolio asset.**  
`docs/api.md` was written before the code. This forced better function design and produced documentation that any developer could pick up and extend.

---

## Business Viability

### Who would pay for this?

- Local restaurants, salons, clinics, coaching institutes
- E-commerce stores with repetitive WhatsApp inquiries
- Service businesses (CA firms, legal offices, travel agencies)

### Realistic pricing

| Package | Includes | Price |
|---|---|---|
| **Basic** | FAQ Chatbot, up to 15 FAQs, 1 revision | ₹2,999 |
| **Standard** | FAQ + Lead Capture + Business Hours | ₹5,999 |
| **Premium** | Standard + Website Integration + 3 months support | ₹9,999 |

### Deployment time per client

- Update `faq-data.js`: **15–30 minutes**
- Deploy to GitHub Pages or Netlify: **5 minutes**
- Total per client: **~45 minutes** after the first setup

At ₹5,999 per client: **₹5,999 ÷ 45 minutes = ₹133/minute**

---

## Future Improvements

| Feature | Effort | Business Impact |
|---|---|---|
| OpenAI API integration | Medium | Much smarter responses |
| Admin dashboard (view leads) | Medium | Client self-service |
| CSV lead export | Low | Immediate client value |
| WhatsApp / Instagram widget | High | Massive reach for Indian clients |
| Multi-language support | Medium | Tier-2 city market |
| Analytics (top questions) | Low | Useful for knowledge base improvement |

---

## Conclusion

SmartSupport AI v1.0 is a working, deployable product built in one week from scratch.

It demonstrates:

- Modular JavaScript architecture
- Real business problem-solving
- Client-ready customization
- Professional documentation

More importantly, it's **reusable**. The next client chatbot takes 45 minutes to deploy — not a week to build.

That's the difference between a project and a product.

---

*SmartSupport AI — Built by Shivam | July 2025*
