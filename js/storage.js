/* ============================================================
   storage.js — SmartSupport AI
   
   Purpose: All localStorage read/write operations live here.
   
   Why a separate storage file?
   - Keeps localStorage access in ONE place
   - If we ever switch to a database, we only change this file
   - Other modules call these functions — they don't touch
     localStorage directly
   
   Features this file handles:
   - Chat history (persist across refresh)
   - Theme preference (dark / light)
   - Captured leads (name, email, phone)
============================================================ */


/* ============================================================
   STORAGE KEYS
   Defined as constants at the top.
   Rule: Never type a key string twice — always use the constant.
   
   Why: A typo in a key string creates a silent bug that's very
   hard to track down. Constants are caught by the editor.
============================================================ */

const STORAGE_KEYS = {
  CHAT_HISTORY : 'smartsupport_chat_history',
  THEME        : 'smartsupport_theme',
  LEADS        : 'smartsupport_leads',
};


/* ============================================================
   CHAT HISTORY
   Saves and loads the full conversation so users can
   refresh the page and still see their previous messages.
============================================================ */

/**
 * Saves the entire chat history array to localStorage.
 * Called after every new message is added.
 * 
 * @param {Array} messages - Array of message objects
 *   Each message: { id, role: 'bot'|'user', text, time }
 */
function saveChatHistory(messages) {
  try {
    localStorage.setItem(
      STORAGE_KEYS.CHAT_HISTORY,
      JSON.stringify(messages)
    );
  } catch (error) {
    // Storage might be full or blocked — fail silently
    console.warn('[Storage] Could not save chat history:', error.message);
  }
}


/**
 * Loads saved chat history from localStorage.
 * Returns an empty array if nothing is saved yet.
 * 
 * @returns {Array} - Array of saved message objects
 */
function loadChatHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn('[Storage] Could not load chat history:', error.message);
    return [];  // Return empty array as safe fallback
  }
}


/**
 * Clears chat history from storage.
 * Called when the user clicks a "Clear Chat" button (future feature).
 */
function clearChatHistory() {
  localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
}


/* ============================================================
   THEME PREFERENCE
   Remembers whether the user prefers dark or light mode.
============================================================ */

/**
 * Saves the user's theme choice.
 * 
 * @param {string} theme - 'dark' or 'light'
 */
function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}


/**
 * Loads the saved theme, defaulting to 'dark'.
 * 
 * @returns {string} - 'dark' or 'light'
 */
function loadTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
}


/* ============================================================
   LEAD CAPTURE
   When the bot collects a visitor's name, email, and phone,
   that's a business lead. We store it locally for now.
   Future: send to a server or Google Sheet via API.
============================================================ */

/**
 * Saves a single captured lead.
 * Loads existing leads, appends the new one, saves back.
 * 
 * @param {Object} lead - { name, email, phone, timestamp }
 */
function saveLead(lead) {
  try {
    const existing = loadLeads();

    // Add timestamp if not already present
    const newLead = {
      ...lead,
      capturedAt: lead.capturedAt || new Date().toISOString()
    };

    existing.push(newLead);

    localStorage.setItem(
      STORAGE_KEYS.LEADS,
      JSON.stringify(existing)
    );

    console.log('[Storage] Lead saved:', newLead);
  } catch (error) {
    console.warn('[Storage] Could not save lead:', error.message);
  }
}


/**
 * Loads all captured leads from storage.
 * 
 * @returns {Array} - Array of lead objects
 */
function loadLeads() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn('[Storage] Could not load leads:', error.message);
    return [];
  }
}


/**
 * Returns total number of leads captured so far.
 * Useful for showing a count in a future admin dashboard.
 * 
 * @returns {number}
 */
function getLeadCount() {
  return loadLeads().length;
}


/**
 * Clears all captured leads from storage.
 * Would be used in an admin panel to reset the list.
 */
function clearLeads() {
  localStorage.removeItem(STORAGE_KEYS.LEADS);
}
