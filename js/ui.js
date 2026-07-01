/* ============================================================
   ui.js — SmartSupport AI
   
   Purpose: ALL DOM manipulation and visual rendering.
   
   Rule: This is the ONLY file that touches the DOM.
   - chatbot.js produces text — ui.js displays it
   - storage.js saves data — ui.js reads display state
   - utils.js transforms data — ui.js renders the result
   
   This separation means:
   - You can redesign the entire chat UI by only editing ui.js
   - You can change chatbot logic without touching display code
============================================================ */


/* ============================================================
   DOM REFERENCES
   Cached at the top so we don't query the DOM repeatedly.
   Each querySelector call is a performance cost — do it once.
============================================================ */

const DOM = {
  chatMessages   : document.getElementById('chat-messages'),
  chatInput      : document.getElementById('chat-input'),
  sendButton     : document.getElementById('btn-send'),
  chatWindow     : document.getElementById('chat-window'),
};


/* ============================================================
   MESSAGE RENDERING
============================================================ */

/**
 * Renders a single message bubble in the chat window.
 * 
 * @param {Object} message - { id, role: 'bot'|'user', text, time }
 * 
 * Why we build HTML as a string then insert it:
 * It's faster than creating 10 individual DOM elements,
 * and easier to read the structure at a glance.
 */
function renderMessage(message) {
  const { id, role, text, time, options } = message;

  const isBot  = role === 'bot';
  const avatar = isBot ? '🤖' : '👤';

  let optionsHtml = '';
  if (isBot && options && options.length > 0) {
    optionsHtml = `
      <div class="message-options" style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
        ${options.map((opt, idx) => `
          <button class="chat-option-btn" 
                  style="text-align: left; background: rgba(37, 99, 235, 0.08); border: 1px solid rgba(37, 99, 235, 0.25); color: var(--primary); padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s;"
                  data-option-index="${idx}">
            ${opt.label}
          </button>
        `).join('')}
      </div>
    `;
  }

  // Build the HTML structure for the message bubble
  const html = `
    <div class="message ${isBot ? 'bot-message' : 'user-message'}" id="${id}">
      <div class="message-avatar">${avatar}</div>
      <div class="message-bubble">
        <p>${text}</p>
        ${optionsHtml}
        <span class="message-time">${time}</span>
      </div>
    </div>
  `;

  // Insert at the end of the messages container
  DOM.chatMessages.insertAdjacentHTML('beforeend', html);

  // Attach click listeners to option buttons
  if (isBot && options && options.length > 0) {
    const messageEl = document.getElementById(id);
    messageEl.querySelectorAll('.chat-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const optIdx = parseInt(btn.dataset.optionIndex);
        const selectedOption = options[optIdx];
        
        // Disable other buttons
        messageEl.querySelectorAll('.chat-option-btn').forEach(b => {
          b.disabled = true;
          b.style.opacity = '0.5';
          b.style.cursor = 'not-allowed';
        });

        if (window.onChatOptionSelect) {
          window.onChatOptionSelect(selectedOption);
        }
      });
    });
  }

  // Always scroll to the latest message after rendering
  scrollToBottom();
}


/**
 * Renders multiple messages at once.
 * Used when restoring chat history from storage on page load.
 * 
 * @param {Array} messages - Array of message objects
 */
function renderChatHistory(messages) {
  // Clear the default welcome message before loading history
  DOM.chatMessages.innerHTML = '';

  messages.forEach(message => renderMessage(message));
}


/* ============================================================
   TYPING INDICATOR
   Shows "SmartSupport AI is typing..." before the bot replies.
   This small detail makes the bot feel much more human.
============================================================ */

/**
 * Shows the typing indicator in the chat window.
 * The indicator has a CSS animation (three bouncing dots).
 */
function showTypingIndicator() {
  const html = `
    <div class="message bot-message" id="typing-indicator">
      <div class="message-avatar">🤖</div>
      <div class="message-bubble typing-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  `;

  DOM.chatMessages.insertAdjacentHTML('beforeend', html);
  scrollToBottom();
}


/**
 * Removes the typing indicator.
 * Called right before the actual bot reply is rendered.
 */
function hideTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.remove();
}


/* ============================================================
   SUGGESTED QUESTIONS
   Quick-tap buttons shown below the chat window.
   One click = instant question sent, instant answer.
============================================================ */

/**
 * Renders the suggested questions row.
 * Takes an array of question strings and creates clickable pills.
 * 
 * @param {Array<string>} questions - e.g. ["Business Hours", "Pricing"]
 * @param {Function} onSelect - Callback when a pill is clicked
 *                              Receives the question string as argument
 */
function renderSuggestedQuestions(questions, onSelect) {
  // Remove any existing suggestions before rendering new ones
  const existing = document.getElementById('suggested-questions');
  if (existing) existing.remove();

  const html = `
    <div id="suggested-questions" class="suggested-questions">
      ${questions.map(q => `
        <button class="suggestion-pill" data-question="${q}">
          📌 ${q}
        </button>
      `).join('')}
    </div>
  `;

  // Insert suggestions BELOW the chat window
  DOM.chatWindow.insertAdjacentHTML('afterend', html);

  // Attach click handlers to each pill
  document.querySelectorAll('.suggestion-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const question = pill.dataset.question;
      onSelect(question);
    });
  });
}


/**
 * Removes the suggested questions row from the DOM.
 * Called after the user sends their first real message.
 */
function hideSuggestedQuestions() {
  const suggestions = document.getElementById('suggested-questions');
  if (suggestions) suggestions.remove();
}


/* ============================================================
   SCROLL
============================================================ */

/**
 * Scrolls the chat messages container to the very bottom.
 * Called after every new message or typing indicator is added.
 * 
 * 'smooth' behavior gives a polished feel vs. instant jump.
 */
function scrollToBottom() {
  DOM.chatMessages.scrollTo({
    top: DOM.chatMessages.scrollHeight,
    behavior: 'smooth'
  });
}


/* ============================================================
   INPUT MANAGEMENT
============================================================ */

/**
 * Returns the current value of the chat input field.
 * 
 * @returns {string}
 */
function getInputValue() {
  return DOM.chatInput.value;
}


/**
 * Clears the chat input field after the user sends a message.
 */
function clearInput() {
  DOM.chatInput.value = '';
  DOM.chatInput.focus();  // Keep focus so user can keep typing
}


/**
 * Disables the input and send button while the bot is "typing".
 * Prevents the user from sending multiple messages mid-response.
 */
function disableInput() {
  DOM.chatInput.disabled  = true;
  DOM.sendButton.disabled = true;
  DOM.sendButton.style.opacity = '0.5';
}


/**
 * Re-enables the input and send button after the bot replies.
 */
function enableInput() {
  DOM.chatInput.disabled  = false;
  DOM.sendButton.disabled = false;
  DOM.sendButton.style.opacity = '1';
  DOM.chatInput.focus();
}


/* ============================================================
   THEME TOGGLE
   Toggles between dark and light mode by swapping a class
   on the <html> element. CSS handles the visual change.
============================================================ */

/**
 * Applies a saved or default theme to the page.
 * Called on page load by app.js.
 * 
 * @param {string} theme - 'dark' or 'light'
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}


/**
 * Toggles between dark and light mode.
 * Returns the new theme so app.js can save it to storage.
 * 
 * @returns {string} - The new active theme ('dark' or 'light')
 */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next    = current === 'dark' ? 'light' : 'dark';

  applyTheme(next);
  return next;  // app.js will call saveTheme(next)
}


/* ============================================================
   NOTIFICATION / STATUS MESSAGES
   Small inline messages for errors or status updates.
============================================================ */

/**
 * Temporarily shows a status message inside the chat
 * (e.g. "Network error — please try again").
 * Auto-removes after 3 seconds.
 * 
 * @param {string} text - Message to show
 * @param {string} type - 'error' | 'info' | 'success'
 */
function showStatusMessage(text, type = 'info') {
  const html = `
    <div class="status-message status-${type}" id="status-msg">
      ${text}
    </div>
  `;

  DOM.chatMessages.insertAdjacentHTML('beforeend', html);
  scrollToBottom();

  // Auto-remove after 3 seconds
  setTimeout(() => {
    const el = document.getElementById('status-msg');
    if (el) el.remove();
  }, 3000);
}
