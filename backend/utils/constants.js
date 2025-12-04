// Application Constants
// Centralized constants for the application
// Author: StressBuster Team

// User roles
const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin'
};

// Appointment statuses
const APPOINTMENT_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show'
};

// Resource types
const RESOURCE_TYPES = {
    VIDEO: 'video',
    PDF: 'pdf',
    AUDIO: 'audio',
    ARTICLE: 'article'
};

// Game types
const GAME_TYPES = {
    BREATHING: 'breathing',
    TAP_TO_RELAX: 'tap_to_relax',
    MEMORY_PUZZLE: 'memory_puzzle',
    CALM_TIMER: 'calm_timer'
};

// Chatbot intents
const CHATBOT_INTENTS = {
    COPING_STRATEGY: 'coping_strategy',
    REFERRAL: 'referral',
    EMOTIONAL_SUPPORT: 'emotional_support',
    GENERAL: 'general'
};

// Sentiment types
const SENTIMENT_TYPES = {
    POSITIVE: 'positive',
    NEGATIVE: 'negative',
    NEUTRAL: 'neutral'
};

// Languages supported
const LANGUAGES = {
    ENGLISH: 'en',
    HINDI: 'hi',
    TAMIL: 'ta',
    TELUGU: 'te',
    BENGALI: 'bn',
    MARATHI: 'mr'
};

// Predefined chatbot responses for common queries
const CHATBOT_RESPONSES = {
    GREETING: "Hello! I'm here to support you. How are you feeling today?",
    STRESS: "I understand you're feeling stressed. Here are some techniques that might help: 1) Deep breathing exercises, 2) Take a short walk, 3) Listen to calming music. Would you like to try any of these?",
    ANXIETY: "Anxiety can be overwhelming. Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, and 1 thing you taste.",
    DEPRESSION: "I hear you're going through a difficult time. Remember, you're not alone. Would you like me to connect you with a professional counselor or share some helpline numbers?",
    SLEEP_ISSUES: "Good sleep is important for mental health. Try these tips: 1) Maintain a regular sleep schedule, 2) Avoid screens 1 hour before bed, 3) Create a relaxing bedtime routine, 4) Keep your bedroom cool and dark.",
    EMERGENCY: "If you're in crisis or need immediate help, please contact these helplines immediately. Your safety is the priority. Would you like me to show you the helpline numbers?",
    REFERRAL: "I can help you book an appointment with a professional counselor. They can provide personalized support. Would you like to see available time slots?",
    DEFAULT: "I'm here to listen and support you. Can you tell me more about what you're experiencing?"
};

// Keywords for intent detection
const INTENT_KEYWORDS = {
    stress: ['stress', 'stressed', 'pressure', 'overwhelmed', 'burden'],
    anxiety: ['anxiety', 'anxious', 'worry', 'nervous', 'panic', 'fear'],
    depression: ['depressed', 'sad', 'hopeless', 'worthless', 'empty'],
    sleep: ['sleep', 'insomnia', 'tired', 'exhausted', 'rest'],
    emergency: ['suicide', 'kill myself', 'end it', 'crisis', 'emergency', 'hurt myself'],
    referral: ['counselor', 'therapist', 'appointment', 'professional', 'help']
};

module.exports = {
    USER_ROLES,
    APPOINTMENT_STATUS,
    RESOURCE_TYPES,
    GAME_TYPES,
    CHATBOT_INTENTS,
    SENTIMENT_TYPES,
    LANGUAGES,
    CHATBOT_RESPONSES,
    INTENT_KEYWORDS
};
