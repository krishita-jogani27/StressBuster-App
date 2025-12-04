// User Routes
// User profile and settings management
// Author: StressBuster Team

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getOne, executeQuery } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// ============================================
// GET USER PROFILE
// GET /api/users/profile
// ============================================
router.get('/profile', authenticate, async (req, res, next) => {
    try {
        const result = await getOne(
            `SELECT id, username, email, full_name, phone, age, gender, preferred_language, 
              is_anonymous, created_at, last_login 
       FROM users WHERE id = ?`,
            [req.user.userId]
        );

        if (!result.data) {
            return errorResponse(res, 'User not found', 404);
        }

        return successResponse(res, result.data, 'Profile retrieved successfully');

    } catch (error) {
        next(error);
    }
});

// ============================================
// UPDATE USER PROFILE
// PUT /api/users/profile
// ============================================
router.put('/profile', authenticate, async (req, res, next) => {
    try {
        const { full_name, phone, age, gender, preferred_language } = req.body;

        const result = await executeQuery(
            `UPDATE users 
       SET full_name = ?, phone = ?, age = ?, gender = ?, preferred_language = ?
       WHERE id = ?`,
            [full_name, phone, age, gender, preferred_language, req.user.userId]
        );

        if (!result.success) {
            return errorResponse(res, 'Failed to update profile', 500);
        }

        return successResponse(res, null, 'Profile updated successfully');

    } catch (error) {
        next(error);
    }
});

module.exports = router;
