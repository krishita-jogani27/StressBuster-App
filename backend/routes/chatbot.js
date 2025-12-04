// Chatbot Routes
// AI-guided chatbot conversation endpoints
// Author: StressBuster Team

const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const { executeQuery, insert } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const { CHATBOT_RESPONSES, INTENT_KEYWORDS, CHATBOT_INTENTS } = require('../utils/constants');

// ============================================
// DETECT INTENT FROM USER MESSAGE
// Simple keyword-based intent detection
// ============================================
const detectIntent = (message) => {
    const lowerMessage = message.toLowerCase();

    // Check for emergency keywords first (highest priority)
    if (INTENT_KEYWORDS.emergency.some(keyword => lowerMessage.includes(keyword))) {
        return { intent: 'emergency', sentiment: 'negative' };
    }

    // Check for referral keywords
    if (INTENT_KEYWORDS.referral.some(keyword => lowerMessage.includes(keyword))) {
        return { intent: 'referral', sentiment: 'neutral' };
    }

    // Check for specific mental health topics
    if (INTENT_KEYWORDS.anxiety.some(keyword => lowerMessage.includes(keyword))) {
        return { intent: 'anxiety', sentiment: 'negative' };
    }

    if (INTENT_KEYWORDS.depression.some(keyword => lowerMessage.includes(keyword))) {
        return { intent: 'depression', sentiment: 'negative' };
    }

    if (INTENT_KEYWORDS.stress.some(keyword => lowerMessage.includes(keyword))) {
        return { intent: 'stress', sentiment: 'negative' };
    }

    if (INTENT_KEYWORDS.sleep.some(keyword => lowerMessage.includes(keyword))) {
        return { intent: 'sleep', sentiment: 'neutral' };
    }

    // Default
    return { intent: 'general', sentiment: 'neutral' };
};

// ============================================
// GENERATE BOT RESPONSE
// Returns appropriate response based on detected intent
// ============================================
const generateResponse = (intent) => {
    const responseMap = {
        'emergency': CHATBOT_RESPONSES.EMERGENCY,
        'referral': CHATBOT_RESPONSES.REFERRAL,
        'anxiety': CHATBOT_RESPONSES.ANXIETY,
        'depression': CHATBOT_RESPONSES.DEPRESSION,
        'stress': CHATBOT_RESPONSES.STRESS,
        'sleep': CHATBOT_RESPONSES.SLEEP_ISSUES,
        'general': CHATBOT_RESPONSES.DEFAULT
    };

    return responseMap[intent] || CHATBOT_RESPONSES.DEFAULT;
};

// ============================================
// SEND MESSAGE TO CHATBOT
// POST /api/chatbot/message
// ============================================
router.post('/message', optionalAuth, async (req, res, next) => {
    try {
        const { message, sessionId } = req.body;
        const userId = req.user ? req.user.userId : null;

        if (!message || !sessionId) {
            return errorResponse(res, 'Message and sessionId are required', 400);
        }

        const startTime = Date.now();

        // Detect intent and sentiment
        const { intent, sentiment } = detectIntent(message);

        // Save user message
        await insert(
            `INSERT INTO chatbot_conversations (user_id, session_id, message, sender, intent, sentiment) 
       VALUES (?, ?, ?, 'user', ?, ?)`,
            [userId, sessionId, message, intent, sentiment]
        );

        // Generate bot response
        const botResponse = generateResponse(intent);
        const responseTime = Date.now() - startTime;

        // Save bot response
        await insert(
            `INSERT INTO chatbot_conversations (user_id, session_id, message, sender, intent, sentiment, response_time_ms) 
       VALUES (?, ?, ?, 'bot', ?, 'neutral', ?)`,
            [userId, sessionId, botResponse, CHATBOT_INTENTS.COPING_STRATEGY, responseTime]
        );

        return successResponse(res, {
            message: botResponse,
            intent,
            sentiment,
            responseTime
        }, 'Message processed successfully');

    } catch (error) {
        next(error);
    }
});

// ============================================
// GET CONVERSATION HISTORY
// GET /api/chatbot/conversation/:sessionId
// ============================================
router.get('/conversation/:sessionId', optionalAuth, async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        const result = await executeQuery(
            `SELECT id, message, sender, intent, sentiment, created_at 
       FROM chatbot_conversations 
       WHERE session_id = ? 
       ORDER BY created_at ASC`,
            [sessionId]
        );

        if (!result.success) {
            return errorResponse(res, 'Failed to fetch conversation', 500);
        }

        return successResponse(res, result.data, 'Conversation retrieved successfully');

    } catch (error) {
        next(error);
    }
});

// ============================================
// GET CHATBOT STATISTICS (for analytics)
// GET /api/chatbot/stats
// ============================================
router.get('/stats', async (req, res, next) => {
    try {
        const result = await executeQuery(
            `SELECT 
        COUNT(*) as total_messages,
        COUNT(DISTINCT session_id) as total_sessions,
        AVG(response_time_ms) as avg_response_time,
        intent,
        COUNT(*) as intent_count
       FROM chatbot_conversations 
       WHERE sender = 'bot'
       GROUP BY intent`
        );

        if (!result.success) {
            return errorResponse(res, 'Failed to fetch statistics', 500);
        }

        return successResponse(res, result.data, 'Statistics retrieved successfully');

    } catch (error) {
        next(error);
    }
});

module.exports = router;
