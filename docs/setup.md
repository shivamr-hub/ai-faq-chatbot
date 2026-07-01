# SmartSupport AI — Setup Guide

> If you cloned this repository, this document tells you everything
> needed to run it locally and deploy it — no questions required.

---

## Requirements

| Requirement | Detail |
|---|---|
| **Browser** | Any modern browser (Chrome, Firefox, Edge, Safari) |
| **Editor** | VS Code recommended |
| **VS Code Extension** | [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (for auto-reload) |
| **Node.js / npm** | ❌ Not required — this is pure HTML/CSS/JS |
| **Build tool** | ❌ Not required |
| **Internet** | ✅ Required only for Google Fonts (Inter) to load |

---

## Installation

### Option A — Clone from GitHub

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/faq-chatbot.git

# 2. Enter the project folder
cd faq-chatbot

# 3. Open in VS Code
code .
```

### Option B — Download ZIP

1. Go to the GitHub repository
2. Click **Code → Download ZIP**
3. Extract the folder
4. Open in VS Code

---

## Running Locally

### With VS Code Live Server (Recommended)

1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` in the file explorer
3. Select **"Open with Live Server"**
4. Your browser opens at `http://127.0.0.1:5500`
5. Changes save → browser refreshes automatically

### Without Live Server

1. Navigate to the project folder in File Explorer
2. Double-click `index.html`
3. It opens directly in your browser

> ⚠️ Note: `localStorage` may not work correctly when opening HTML
> files directly from the filesystem (`file://` protocol).  
> Use Live Server for full functionality.

---

## Folder Structure

```
faq-chatbot/
│
├── index.html              ← Main page (open this in browser)
│
├── css/
│   └── style.css           ← Full design system (9 sections)
│
├── js/
│   ├── utils.js            ← Pure helper functions
│   ├── storage.js          ← localStorage wrapper
│   ├── faq-data.js         ← Business knowledge base
│   ├── ui.js               ← DOM rendering
│   ├── chatbot.js          ← Bot engine and lead capture
│   └── app.js              ← App entry point + event listeners
│
├── assets/
│   └── screenshots/        ← UI screenshots for README
│
├── docs/
│   ├── architecture.md     ← Module structure and data flow
│   ├── api.md              ← Function reference for all modules
│   ├── setup.md            ← This file
│   └── screenshots/        ← Documentation screenshots
│
├── README.md
├── CHANGELOG.md
├── LICENSE
└── .gitignore
```

---

## Customizing for a Client

All client-specific information lives in **one file**:

```
js/faq-data.js
```

To set up the chatbot for a new business:

1. Open `js/faq-data.js`
2. Update `businessName`, `contact`, `businessHours`
3. Replace or add entries in `faqs[]` with the client's real questions
4. Add their `services[]` and `pricing[]` if applicable
5. Save — the chatbot immediately reflects the new information

No other files need to change for a basic client deployment.

---

## Deployment

### GitHub Pages (Free)

1. Push the project to a GitHub repository
2. Go to **Settings → Pages**
3. Under **Source**, select `main` branch, `/ (root)` folder
4. Click **Save**
5. GitHub provides a URL like: `https://yourusername.github.io/faq-chatbot`

> The site goes live within 1–2 minutes.

### Netlify (Free, Easier)

1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Drag and drop the entire `faq-chatbot/` folder onto the Netlify dashboard
4. Netlify gives you a live URL instantly
5. Optional: set a custom subdomain (e.g., `smartsupport.netlify.app`)

### Client's Existing Website

To embed the chatbot as a floating widget on a client's website:

> ⏳ This will be covered in a future update when the widget
> version is built. See `docs/architecture.md` — Planned Features.

---

## Environment Variables

This project has **no environment variables** in its current version.

If you add an OpenAI API key in a future version:

1. Create a backend proxy (never expose API keys in client-side JS)
2. Store the key in a `.env` file
3. The `.env` file is already excluded by `.gitignore`

> ⚠️ Never commit API keys to a public GitHub repository.

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| Page is blank | Script error | Open browser DevTools → Console tab, check for errors |
| Chat not saving | `file://` protocol | Use Live Server instead of opening the HTML directly |
| Fonts not loading | No internet | Connect to internet or use a local fallback font |
| Styles missing | Wrong file path | Confirm `css/style.css` exists and the path is correct |
| Bot not responding | `faq-data.js` empty | Add at least one FAQ entry to the knowledge base |

---

## Contributing

This is a portfolio project. If you're a collaborator:

1. Create a new branch: `git checkout -b feat/your-feature-name`
2. Make your changes
3. Commit using conventional commit format: `feat: add lead export button`
4. Open a pull request against `main`

Commit message format:

```
feat:     new feature
fix:      bug fix
style:    CSS / design change
docs:     documentation update
refactor: code reorganization, no behavior change
```

---

*Last updated: Stage 3 — Architecture Setup*
