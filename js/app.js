/* ============================================================
   app.js — SmartSupport AI
   Entry Point: Initializes the app and binds all events.
   
   This file is the conductor — it doesn't do the work itself,
   it tells the right module to do the right thing.
   
   Load order (enforced by index.html):
     utils.js → storage.js → faq-data.js → ui.js → chatbot.js → app.js
============================================================ */


/* ============================================================
   In-memory message log.
   Every message sent/received is pushed here and saved to
   localStorage via storage.js after each exchange.
   
   Shape: Array of { id, role, text, time }
============================================================ */
let messageLog = [];


/* ============================================================
   init()
   Called once when the DOM is fully loaded.
   Sets up everything the user needs before their first click.
============================================================ */
function init() {

  // 1. Restore theme preference
  const savedTheme = loadTheme();
  applyTheme(savedTheme);

  // 2. Restore chat history (if user has visited before)
  const history = loadChatHistory();

  if (history.length > 0) {
    messageLog = history;
    renderChatHistory(history);
  } else {
    // First visit — clear hardcoded welcome and render it with buttons
    DOM.chatMessages.innerHTML = '';
    const welcomeMsg = {
      id:   'msg-welcome',
      role: 'bot',
      text: 'Hello! 👋 Welcome to SmartSupport AI. How can I help you today?',
      time: 'Just now',
      options: CHAT_MENU.main.options
    };
    renderMessage(welcomeMsg);
    messageLog.push(welcomeMsg);
    saveChatHistory(messageLog);
  }

  // 3. Show suggested question pills below the chat window
  renderSuggestedQuestions(
    BUSINESS.suggestedQuestions,
    (question) => handleSend(question)   // clicking a pill = sending that text
  );

  // 4. Bind all user interaction events
  _bindEvents();
}


/* ============================================================
   handleSend(inputText?)
   The most important function in the app.
   
   Orchestrates the full send → reply → render → save flow.
   
   @param {string} [inputText] — optional, used by suggestion pills
                                 if not provided, reads from #chat-input
============================================================ */
async function handleSend(inputText) {

  // Get the message text — either from a pill click or the input field
  const rawText = inputText !== undefined ? inputText : getInputValue();

  // Guard: don't send empty messages
  if (isEmpty(rawText)) return;

  // After first real message, hide the suggestion pills
  hideSuggestedQuestions();

  // Clear the input field immediately
  clearInput();

  // ── 1. Build and render the USER message ────────────────
  const userMessage = {
    id:   generateId(),
    role: 'user',
    text: rawText,
    time: getTimestamp()
  };

  renderMessage(userMessage);
  messageLog.push(userMessage);

  // ── 2. Lock input while bot is "thinking" ───────────────
  disableInput();
  showTypingIndicator();

  // ── 3. Get reply from the chatbot engine ─────────────────
  // bot.reply() is async — it includes the realistic typing delay internally
  const response = await bot.reply(rawText);

  // ── 4. Remove typing indicator, render bot reply ─────────
  hideTypingIndicator();

  const botMessage = {
    id:   generateId(),
    role: 'bot',
    text: response.text,
    time: getTimestamp()
  };

  renderMessage(botMessage);
  messageLog.push(botMessage);

  // ── 5. Save conversation to localStorage ─────────────────
  saveChatHistory(messageLog);

  // ── 6. Re-enable input for next message ──────────────────
  enableInput();

  // ── 7. If lead capture just completed, show suggestions again ──
  if (response.type === 'lead_complete') {
    renderSuggestedQuestions(
      BUSINESS.suggestedQuestions,
      (question) => handleSend(question)
    );
  }
}


/* ============================================================
   _bindEvents()
   Private — attaches all DOM event listeners.
   Kept separate from init() to stay readable.
============================================================ */
function _bindEvents() {

  const sendButton = document.getElementById('btn-send');
  const chatInput  = document.getElementById('chat-input');

  // Send button click
  sendButton.addEventListener('click', () => handleSend());

  // Enter key inside the input field
  chatInput.addEventListener('keydown', (event) => {
    // Send on Enter — but Shift+Enter creates a newline (future multi-line support)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();  // don't submit any parent forms
      handleSend();
    }
  });

  // Navbar smooth scroll — ensure anchor links work with the fixed navbar offset
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      e.preventDefault();

      // Account for fixed navbar height (68px) so the section isn't hidden under it
      const navHeight = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height') || '68'
      );

      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Navbar scroll effect — add shadow + reduced opacity when scrolled
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/**
 * Handles selection of a menu option button in the chat.
 */
window.onChatOptionSelect = async function(option) {
  // 1. Render User choice as a message bubble
  const userMsg = {
    id: generateId(),
    role: 'user',
    text: option.label,
    time: getTimestamp()
  };
  renderMessage(userMsg);
  messageLog.push(userMsg);
  saveChatHistory(messageLog);

  // Lock input and show loading dots
  disableInput();
  showTypingIndicator();

  // Simulate a realistic short typing delay
  await delay(500 + Math.random() * 400);
  hideTypingIndicator();

  // 2. Determine bot reply based on option data
  let botReply = { text: "" };

  if (option.next) {
    const nextMenu = CHAT_MENU[option.next];
    botReply = {
      text: nextMenu.text,
      options: nextMenu.options
    };
  } else if (option.answer) {
    botReply = {
      text: option.answer,
      options: CHAT_MENU.main.options // default back to main menu
    };
  } else if (option.action === 'start_lead') {
    const leadResponse = bot._startLeadCapture();
    botReply = {
      text: leadResponse.text
    };
  }

  // 3. Render bot response
  const botMsg = {
    id: generateId(),
    role: 'bot',
    text: botReply.text,
    time: getTimestamp(),
    options: botReply.options
  };

  renderMessage(botMsg);
  messageLog.push(botMsg);
  saveChatHistory(messageLog);
  enableInput();
};

/* ============================================================
   Bootstrap — start the app when the page finishes loading.
   
   DOMContentLoaded fires when the HTML is parsed.
   We wait for it because init() needs to query DOM elements
   (like #chat-input) that must exist before we reference them.
============================================================ */
document.addEventListener('DOMContentLoaded', init);
