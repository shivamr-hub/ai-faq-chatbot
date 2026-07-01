/* ============================================================
   utils.js — SmartSupport AI
   
   Purpose: Small, reusable helper functions.
   
   Rules for this file:
   - NO DOM access (no document.querySelector, etc.)
   - NO side effects (functions only return values)
   - Every function does ONE thing
   - If a function is longer than 10 lines, it probably belongs elsewhere
   
   Why a separate utils file?
   These helpers are used by ALL other modules.
   Keeping them here means we never duplicate logic.
============================================================ */


/**
 * Cleans and normalizes a user's input string.
 * Removes extra spaces, converts to lowercase for matching.
 * 
 * @param {string} text - Raw user input
 * @returns {string} - Cleaned, lowercase text
 * 
 * Example:
 *   normalizeText("  What are YOUR hours??  ")
 *   → "what are your hours"
 */
function normalizeText(text) {
  return text
    .toLowerCase()       // case-insensitive matching
    .trim()              // remove leading/trailing spaces
    .replace(/[?!.,;:]/g, '')  // remove punctuation
    .replace(/\s+/g, ' ');     // collapse multiple spaces into one
}


/**
 * Formats the current time as "HH:MM AM/PM"
 * Used to display a timestamp on each chat message.
 * 
 * @returns {string} - Formatted time string
 * 
 * Example:
 *   getTimestamp() → "9:34 AM"
 */
function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}


/**
 * Checks if a string is empty or only whitespace.
 * Prevents the bot from responding to blank messages.
 * 
 * @param {string} text - Input to check
 * @returns {boolean} - true if blank, false if has content
 * 
 * Example:
 *   isEmpty("  ") → true
 *   isEmpty("Hello") → false
 */
function isEmpty(text) {
  return !text || text.trim().length === 0;
}


/**
 * Calculates a simple keyword match score.
 * Counts how many words from the query appear in the target string.
 * Used by chatbot.js to rank FAQ answers by relevance.
 * 
 * @param {string} query   - The user's normalized input
 * @param {string} target  - The FAQ keyword string to match against
 * @returns {number} - Number of matching words (higher = better match)
 * 
 * Example:
 *   matchScore("business hours monday", "business hours open monday friday")
 *   → 3  (business, hours, monday all matched)
 */
function matchScore(query, target) {
  const queryWords  = query.split(' ');
  const targetWords = target.split(' ');

  let score = 0;

  queryWords.forEach(word => {
    // Only count words longer than 2 characters (ignore "is", "a", "to", etc.)
    if (word.length > 2 && targetWords.includes(word)) {
      score++;
    }
  });

  return score;
}


/**
 * Generates a short random ID.
 * Used to give each message a unique ID for future DOM targeting.
 * 
 * @returns {string} - e.g. "msg_k7f2x"
 */
function generateId() {
  return 'msg_' + Math.random().toString(36).slice(2, 7);
}


/**
 * Delays execution for a given number of milliseconds.
 * Used to simulate typing delay before the bot replies.
 * Returns a Promise so it works with async/await.
 * 
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} - Resolves after the delay
 * 
 * Example:
 *   await delay(1200);  // wait 1.2 seconds
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * Capitalizes the first letter of a string.
 * Used when displaying user-entered names or cities.
 * 
 * @param {string} text
 * @returns {string}
 * 
 * Example:
 *   capitalize("john") → "John"
 */
function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}


/**
 * Validates if a string looks like an email address.
 * Used during lead capture to check user input.
 * 
 * @param {string} email
 * @returns {boolean}
 * 
 * Example:
 *   isValidEmail("hello@gmail.com") → true
 *   isValidEmail("notanemail")      → false
 */
function isValidEmail(email) {
  // Standard email pattern — covers 99% of real cases
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email.trim());
}


/**
 * Validates if a string looks like a phone number.
 * Accepts 10-digit Indian numbers with optional +91 prefix.
 * 
 * @param {string} phone
 * @returns {boolean}
 * 
 * Example:
 *   isValidPhone("9876543210")    → true
 *   isValidPhone("+919876543210") → true
 *   isValidPhone("123")           → false
 */
function isValidPhone(phone) {
  const cleaned = phone.replace(/[\s\-\(\)]/g, ''); // remove formatting
  const pattern = /^(\+91)?[6-9]\d{9}$/;             // Indian mobile format
  return pattern.test(cleaned);
}
