// Admin Routes
// Admin dashboard analytics and management
// Author: StressBuster Team

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { executeQuery, getOne } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// ============================================
// ADMIN LOGIN
// POST /api/admin/login
// ============================================
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const admin = await getOne(
            'SELECT id, username, email, password_hash, role, is_active FROM admin_users WHERE email = ?',
            [email]
        );

        if (!admin.data) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        if (!admin.data.is_active) {
            return errorResponse(res, 'Account is deactivated', 403);
        }

        const isPasswordValid = await bcrypt.compare(password, admin.data.password_hash);

        if (!isPasswordValid) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        // Update last login
        await executeQuery('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [admin.data.id]);

        // Generate token
        const token = jwt.sign(
            { adminId: admin.data.id, role: admin.data.role, isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return successResponse(res, {
            adminId: admin.data.id,
            username: admin.data.username,
            role: admin.data.role,
            token
        }, 'Login successful');

    } catch (error) {
        next(error);
    }
});

// ============================================
// GET DASHBOARD ANALYTICS
// GET /api/admin/analytics
// ============================================
router.get('/analytics', async (req, res, next) => {
    try {
        // Get overall statistics
        const stats = await executeQuery('SELECT * FROM dashboard_analytics');

        // Get chatbot queries by day (last 7 days)
        const chatbotTrends = await executeQuery(
            `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM chatbot_conversations
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
        );

        // Get appointment trends (last 30 days)
        const appointmentTrends = await executeQuery(
            `SELECT DATE(created_at) as date, status, COUNT(*) as count
       FROM appointments
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       GROUP BY DATE(created_at), status
       ORDER BY date ASC`
        );

        // Get game engagement
        const gameEngagement = await executeQuery(
            `SELECT game_type, COUNT(*) as sessions, AVG(duration_seconds) as avg_duration
       FROM game_sessions
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY game_type`
        );

        // Get resource popularity
        const popularResources = await executeQuery(
            `SELECT id, title, resource_type, view_count, download_count
       FROM resources
       WHERE is_active = TRUE
       ORDER BY view_count DESC
       LIMIT 10`
        );

        return successResponse(res, {
            overview: stats.data[0],
            chatbotTrends: chatbotTrends.data,
            appointmentTrends: appointmentTrends.data,
            gameEngagement: gameEngagement.data,
            popularResources: popularResources.data
        }, 'Analytics retrieved successfully');

    } catch (error) {
        next(error);
    }
});

// ============================================
// GET CHATBOT QUERY DETAILS
// GET /api/admin/chatbot-queries
// ============================================
router.get('/chatbot-queries', async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const queries = await executeQuery(
            `SELECT session_id, intent, sentiment, COUNT(*) as message_count, 
              MAX(created_at) as last_message
       FROM chatbot_conversations
       GROUP BY session_id, intent, sentiment
       ORDER BY last_message DESC
       LIMIT ? OFFSET ?`,
            [parseInt(limit), offset]
        );

        const countResult = await executeQuery(
            'SELECT COUNT(DISTINCT session_id) as total FROM chatbot_conversations'
        );

        return successResponse(res, {
            queries: queries.data,
            total: countResult.data[0].total,
            page: parseInt(page),
            limit: parseInt(limit)
        }, 'Chatbot queries retrieved successfully');

    } catch (error) {
        next(error);
    }
});

// ============================================
// GET BOOKING TRENDS
// GET /api/admin/booking-trends
// ============================================
router.get('/booking-trends', async (req, res, next) => {
    try {
        const trends = await executeQuery(
            `SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_bookings,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
        SUM(CASE WHEN is_anonymous = TRUE THEN 1 ELSE 0 END) as anonymous_bookings
       FROM appointments
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
        );

        return successResponse(res, trends.data, 'Booking trends retrieved successfully');

    } catch (error) {
        next(error);
    }
});

module.exports = router;
