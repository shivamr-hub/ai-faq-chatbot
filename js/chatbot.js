/* ============================================================
   chatbot.js — SmartSupport AI
   Milestones B + C: Match Engine + Lead Capture State Machine
   
   This class is the brain of the chatbot.
   
   It does three things:
   1. KNOWLEDGE ENGINE — match user input to a FAQ answer
   2. CONVERSATION ENGINE — manage context and state
   3. LEAD ENGINE — collect name, email, phone step by step
============================================================ */

class SmartSupportBot {

  constructor() {

    /* ── Lead Capture State Machine ──────────────────────────
       Tracks exactly where we are in a lead capture conversation.
       
       States:
         IDLE           → normal FAQ mode
         WAITING_NAME   → asked for name, waiting for reply
         WAITING_EMAIL  → have name, waiting for email
         WAITING_PHONE  → have name + email, waiting for phone
         COMPLETE       → lead saved, conversation continues normally
       
       Why a state machine?
       Instead of messy nested if/else, each state handles
       exactly ONE thing. Easy to extend, easy to debug.
    ──────────────────────────────────────────────────────── */
    this.leadState = 'IDLE';

    // Temporary storage while collecting lead details
    this.leadData = {
      name:  '',
      email: '',
      phone: ''
    };
  }


  /* ============================================================
     reply(userInput) — Main Entry Point
     
     Called by app.js whenever the user sends a message.
     Returns a Promise so we can await it (needed for the delay).
     
     @param  {string}          userInput — raw text from the input field
     @returns {Promise<Object>}           — { text, type }
  ============================================================ */
  async reply(userInput) {

    // Simulate realistic thinking time (500ms – 1500ms)
    const thinkTime = 700 + Math.random() * 600;
    await delay(thinkTime);

    const input = normalizeText(userInput);

    /* ── Step 1: Handle lead capture flow first ──────────────
       If we're mid-conversation collecting contact details,
       that takes priority over FAQ matching.
    ──────────────────────────────────────────────────────── */
    if (this.leadState !== 'IDLE') {
      return this._handleLeadStep(userInput.trim());
    }

    /* ── Step 2: Check for greetings ─────────────────────────
       Keep it short and friendly.
    ──────────────────────────────────────────────────────── */
    if (this._isGreeting(input)) {
      return {
        text: `Hello! 👋 Welcome to ${BUSINESS.name}. How can I help you today?`,
        type: 'greeting'
      };
    }

    /* ── Step 3: Check for lead trigger words ────────────────
       Words like "quotation", "hire", "interested", "demo".
    ──────────────────────────────────────────────────────── */
    if (this._isLeadTrigger(input)) {
      return this._startLeadCapture();
    }

    /* ── Step 4: FAQ keyword matching ────────────────────────
       Score every FAQ, pick the best match above threshold.
    ──────────────────────────────────────────────────────── */
    const match = this._findBestMatch(input);

    if (match) {
      return {
        text:       match.answer,
        confidence: match.score,
        type:       'faq'
      };
    }

    /* ── Step 5: Fallback ────────────────────────────────────
       No match found — rotate through fallback replies.
    ──────────────────────────────────────────────────────── */
    return {
      text: this._getFallback(),
      type: 'fallback'
    };
  }


  /* ============================================================
     KNOWLEDGE ENGINE — Private Methods
  ============================================================ */

  /**
   * Scores all FAQs and returns the best match above threshold.
   * Returns null if no FAQ scores high enough.
   * 
   * @param   {string} input — normalized user input
   * @returns {Object|null}  — { answer, score } or null
   */
  _findBestMatch(input) {
    let bestMatch = null;
    let bestScore = 0;

    BUSINESS.faqs.forEach(faq => {
      // Join the FAQ's keywords into a single string for scoring
      const keywordString = faq.keywords.join(' ');
      const score = matchScore(input, keywordString);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = { answer: faq.answer, score };
      }
    });

    // Minimum score of 1 — must match at least one meaningful keyword
    return bestScore >= 1 ? bestMatch : null;
  }

  /**
   * Returns true if the input looks like a greeting.
   * 
   * @param {string} input — normalized input
   * @returns {boolean}
   */
  _isGreeting(input) {
    const words = input.split(/\s+/);
    return BUSINESS.greetings.some(g => words.includes(g));
  }

  /**
   * Returns true if the input contains a lead trigger word.
   * 
   * @param {string} input — normalized input
   * @returns {boolean}
   */
  _isLeadTrigger(input) {
    return BUSINESS.leadTriggers.some(trigger =>
      input.includes(trigger.toLowerCase())
    );
  }

  /**
   * Returns a random fallback reply from the list.
   * Rotating replies feel less robotic than a fixed message.
   * 
   * @returns {string}
   */
  _getFallback() {
    const replies = BUSINESS.fallbackReplies;
    const index   = Math.floor(Math.random() * replies.length);
    return replies[index];
  }


  /* ============================================================
     LEAD ENGINE — State Machine
  ============================================================ */

  /**
   * Starts the lead capture flow.
   * Called when a lead trigger word is detected.
   * Transitions state from IDLE → WAITING_NAME.
   * 
   * @returns {Object} — first bot reply in the capture flow
   */
  _startLeadCapture() {
    this.leadState = 'WAITING_NAME';

    // Reset any previous partial capture
    this.leadData = { name: '', email: '', phone: '' };

    return {
      text: "I'd love to help! Let me get a few details so our team can reach you. 😊\n\nWhat's your name?",
      type: 'lead'
    };
  }

  /**
   * Handles each step of the lead capture conversation.
   * Called instead of FAQ matching when leadState !== 'IDLE'.
   * 
   * Each step:
   * 1. Validates the user's reply
   * 2. Saves it to this.leadData
   * 3. Advances to the next state
   * 4. Returns the next question (or completion message)
   * 
   * @param   {string} rawInput — raw (untrimmed) user input
   * @returns {Object}          — { text, type }
   */
  _handleLeadStep(rawInput) {

    switch (this.leadState) {

      // ── Expecting: Name ──────────────────────────────────
      case 'WAITING_NAME': {
        if (isEmpty(rawInput)) {
          return {
            text: "I didn't catch your name. Could you please type it?",
            type: 'lead'
          };
        }

        this.leadData.name = capitalize(rawInput);
        this.leadState     = 'WAITING_EMAIL';

        return {
          text: `Nice to meet you, ${this.leadData.name}! 👋\n\nWhat's your email address?`,
          type: 'lead'
        };
      }

      // ── Expecting: Email ─────────────────────────────────
      case 'WAITING_EMAIL': {
        if (!isValidEmail(rawInput)) {
          return {
            text: "That doesn't look like a valid email. Could you double-check? (Example: you@gmail.com)",
            type: 'lead'
          };
        }

        this.leadData.email = rawInput.trim().toLowerCase();
        this.leadState      = 'WAITING_PHONE';

        return {
          text: "Got it! ✅\n\nAnd your phone number?",
          type: 'lead'
        };
      }

      // ── Expecting: Phone ─────────────────────────────────
      case 'WAITING_PHONE': {
        if (!isValidPhone(rawInput)) {
          return {
            text: "Please enter a valid 10-digit phone number. (Example: 9876543210)",
            type: 'lead'
          };
        }

        this.leadData.phone = rawInput.trim();
        this.leadState      = 'COMPLETE';

        // Save to localStorage via storage.js
        saveLead({
          name:  this.leadData.name,
          email: this.leadData.email,
          phone: this.leadData.phone
        });

        // Log to console for easy verification during demo
        console.log('✅ Lead captured:', this.leadData);

        // Reset state — bot returns to normal FAQ mode
        this.leadState = 'IDLE';

        return {
          text: `Thank you, ${this.leadData.name}! 🎉\n\nWe've saved your details and our team will contact you at ${this.leadData.email} or ${this.leadData.phone} shortly.\n\nIs there anything else I can help with?`,
          type: 'lead_complete'
        };
      }

      // ── Safety net — should never reach here ─────────────
      default: {
        this.leadState = 'IDLE';
        return {
          text: this._getFallback(),
          type: 'fallback'
        };
      }

    }
  }

}


/* ============================================================
   Single bot instance — created once, used across the app.
   
   Why a single instance?
   The bot needs to remember its leadState across messages.
   If we created a new instance per message, state would reset.
============================================================ */
const bot = new SmartSupportBot();
