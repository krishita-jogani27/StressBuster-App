// Game Routes
// Stress-buster game session tracking
// Author: StressBuster Team

const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const { executeQuery, insert } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// ============================================
// SAVE GAME SESSION
// POST /api/games/sessions
// ============================================
router.post('/sessions', optionalAuth, async (req, res, next) => {
    try {
        const { gameType, durationSeconds, score, completed, stressLevelBefore, stressLevelAfter } = req.body;
        const userId = req.user ? req.user.userId : null;

        if (!gameType) {
            return errorResponse(res, 'Game type is required', 400);
        }

        const result = await insert(
            `INSERT INTO game_sessions (user_id, game_type, duration_seconds, score, completed, stress_level_before, stress_level_after) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, gameType, durationSeconds || 0, score || 0, completed || false, stressLevelBefore || null, stressLevelAfter || null]
        );

        if (!result.success) {
            return errorResponse(res, 'Failed to save game session', 500);
        }

        return successResponse(res, {
            sessionId: result.insertId
        }, 'Game session saved successfully', 201);

    } catch (error) {
        next(error);
    }
});

// ============================================
// GET ALL GAME SESSIONS
// GET /api/games/sessions?limit=10
// ============================================
router.get('/sessions', async (req, res, next) => {
    try {
        const { limit = 10 } = req.query;

        const result = await executeQuery(
            `SELECT id, user_id, game_type, duration_seconds, score, completed, created_at
             FROM game_sessions 
             ORDER BY created_at DESC 
             LIMIT ?`,
            [parseInt(limit)]
        );

        if (!result.success) {
            return errorResponse(res, 'Failed to fetch game sessions', 500);
        }

        return successResponse(res, result.data, 'Game sessions retrieved successfully');

    } catch (error) {
        next(error);
    }
});

// ============================================
// GET USER GAME SESSIONS
// GET /api/games/sessions/my
// ============================================
router.get('/sessions/my', optionalAuth, async (req, res, next) => {
    try {
        if (!req.user) {
            return errorResponse(res, 'Authentication required', 401);
        }

        const result = await executeQuery(
            `SELECT id, game_type, duration_seconds, score, completed, 
              stress_level_before, stress_level_after, created_at
       FROM game_sessions 
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 20`,
            [req.user.userId]
        );

        if (!result.success) {
            return errorResponse(res, 'Failed to fetch game sessions', 500);
        }

        return successResponse(res, result.data, 'Game sessions retrieved successfully');

    } catch (error) {
        next(error);
    }
});

// ============================================
// GET GAME STATISTICS
// GET /api/games/stats
// ============================================
router.get('/stats', async (req, res, next) => {
    try {
        const result = await executeQuery(
            `SELECT 
        game_type,
        COUNT(*) as total_sessions,
        AVG(duration_seconds) as avg_duration,
        AVG(score) as avg_score,
        AVG(stress_level_before) as avg_stress_before,
        AVG(stress_level_after) as avg_stress_after
       FROM game_sessions 
       WHERE completed = TRUE
       GROUP BY game_type`
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
