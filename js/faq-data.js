/* ============================================================
   faq-data.js — SmartSupport AI
   Milestone A: Knowledge Base
   
   THIS IS THE ONLY FILE A CLIENT NEEDS TO EDIT.
   
   To customize for a new business:
   1. Update BUSINESS.name, contact, hours
   2. Replace faqs[] with the client's real questions
   3. Update services[]
   4. Done — chatbot adapts automatically
============================================================ */

const BUSINESS = {

  name: "SmartSupport AI",

  description: "AI-powered customer support assistant for modern businesses.",

  contact: {
    phone:   "+91 63555 79882",
    email:   "booking.shivamr@gmail.com",
    address: "Mumbai, Maharashtra"
  },

  hours: {
    weekdays: "Mon–Fri",
    timing:   "9AM–6PM",
    weekend:  "Closed on weekends"
  },

  services: [
    "AI Chatbots",
    "Website Development",
    "AI Automation"
  ],

  /* ── FAQs ──────────────────────────────────────────────────
     Each entry has:
     - keywords: words that trigger this answer (lowercase)
     - answer:   what the bot says back
     
     Tip for clients: add more keywords = more accurate matching.
  ──────────────────────────────────────────────────────────── */
  faqs: [
    {
      keywords: ["hours", "open", "timing", "time", "close", "working", "available"],
      answer: "We're open Monday to Friday, 9AM–6PM. Closed on weekends."
    },
    {
      keywords: ["phone", "call", "number", "contact", "reach", "talk"],
      answer: "You can call us at +91 63555 79882. We're available Mon–Fri, 9AM–6PM."
    },
    {
      keywords: ["email", "mail", "write", "message"],
      answer: "Send us an email at booking.shivamr@gmail.com and we'll reply within 24 hours."
    },
    {
      keywords: ["address", "location", "where", "office", "visit", "place"],
      answer: "We're based in Mumbai, Maharashtra. Drop us an email to schedule a visit."
    },
    {
      keywords: ["services", "offer", "provide", "do", "build", "make", "create"],
      answer: "We offer AI Chatbots, Website Development, and AI Automation solutions for small businesses."
    },
    {
      keywords: ["chatbot", "bot", "chat", "ai", "artificial", "intelligence", "smart"],
      answer: "We build custom AI chatbots that answer FAQs, collect leads, and work 24/7 for your business."
    },
    {
      keywords: ["website", "web", "site", "design", "develop", "landing", "page"],
      answer: "We design and develop modern, responsive websites optimized for conversions."
    },
    {
      keywords: ["automation", "automate", "workflow", "process", "save", "time"],
      answer: "We build AI automations that save your team hours of repetitive work every week."
    },
    {
      keywords: ["price", "pricing", "cost", "charge", "fee", "rate", "package"],
      answer: "Our packages start from ₹3,000. Share your requirements and we'll give you an exact quote!"
    },
    {
      keywords: ["quotation", "quote", "proposal", "estimate"],
      answer: "I'd love to help with a quotation! Let me collect a few details from you."
    }
  ],

  /* ── Lead Triggers ─────────────────────────────────────────
     If ANY of these words appear in a message, the bot
     switches into Lead Capture mode and asks for contact info.
  ──────────────────────────────────────────────────────────── */
  leadTriggers: [
    "quotation", "quote", "hire", "interested", "buy", "purchase",
    "demo", "proposal", "get started", "sign up", "work with"
  ],

  /* ── Greeting Triggers ─────────────────────────────────────
     Triggers the welcome response instead of FAQ matching.
  ──────────────────────────────────────────────────────────── */
  greetings: [
    "hi", "hello", "hey", "good morning", "good afternoon",
    "good evening", "howdy", "greetings", "sup", "yo"
  ],

  /* ── Fallback Replies ──────────────────────────────────────
     Shown when no FAQ matches. Rotated randomly so it doesn't
     feel robotic when triggered multiple times.
  ──────────────────────────────────────────────────────────── */
  fallbackReplies: [
    "I'm not sure about that, but I'd love to help! You can reach us at +91 63555 79882 or booking.shivamr@gmail.com.",
    "Great question! For detailed information, please call us at +91 63555 79882 or drop an email.",
    "I don't have an answer for that right now. Would you like me to collect your details so our team can follow up?",
    "That's a bit outside my knowledge base! Feel free to contact us directly at booking.shivamr@gmail.com."
  ],

  /* ── Suggested Questions ───────────────────────────────────
     Shown as quick-tap pill buttons below the chat window.
     These are the most common questions real visitors ask.
  ──────────────────────────────────────────────────────────── */
  suggestedQuestions: [
    "Business Hours",
    "Our Services",
    "Pricing",
    "Contact Us"
  ]

};
