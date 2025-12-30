// Users Routes
// User management endpoints
// Author: StressBuster Team

const express = require('express');
const router = express.Router();
const { executeQuery, getOne, update } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const { authenticate } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validator');

// ============================================
// GET USER PROFILE
// GET /api/users/profile
// ============================================
router.get('/profile', authenticate, async (req, res, next) => {
    try {
        console.log('📋 Profile request for user:', req.user.userId);

        const userResult = await getOne(
            `SELECT id, username, email, full_name, phone, age, gender, 
                    preferred_language, created_at, last_login 
             FROM users 
             WHERE id = ?`,
            [req.user.userId]
        );

        if (!userResult.data) {
            console.log('❌ User not found:', req.user.userId);
            return errorResponse(res, 'User not found', 404);
        }

        console.log('✅ Profile loaded for user:', userResult.data.username);
        return successResponse(res, userResult.data, 'Profile retrieved successfully');
    } catch (error) {
        console.error('❌ Profile load error:', error.message);
        next(error);
    }
});

// ============================================
// UPDATE USER PROFILE
// PUT /api/users/profile
// ============================================
router.put('/profile',
    authenticate,
    [
        body('full_name').optional().trim(),
        body('phone').optional().trim(),
        body('age').optional().isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
        body('gender').optional().isIn(['male', 'female', 'other', 'prefer_not_to_say']).withMessage('Invalid gender'),
        body('preferred_language').optional().isIn(['en', 'hi', 'es', 'fr']).withMessage('Invalid language'),
        validate
    ],
    async (req, res, next) => {
        try {
            console.log('📝 Profile update request for user:', req.user.userId);
            const { full_name, phone, age, gender, preferred_language } = req.body;

            const updateFields = [];
            const updateValues = [];

            if (full_name !== undefined) {
                updateFields.push('full_name = ?');
                updateValues.push(full_name);
            }
            if (phone !== undefined) {
                updateFields.push('phone = ?');
                updateValues.push(phone);
            }
            if (age !== undefined) {
                updateFields.push('age = ?');
                updateValues.push(age);
            }
            if (gender !== undefined) {
                updateFields.push('gender = ?');
                updateValues.push(gender);
            }
            if (preferred_language !== undefined) {
                updateFields.push('preferred_language = ?');
                updateValues.push(preferred_language);
            }

            if (updateFields.length === 0) {
                return errorResponse(res, 'No fields to update', 400);
            }

            updateValues.push(req.user.userId);

            const result = await update(
                `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
                updateValues
            );

            if (!result.success) {
                console.log('❌ Profile update failed');
                return errorResponse(res, 'Failed to update profile', 500);
            }

            // Get updated profile
            const updatedProfile = await getOne(
                `SELECT id, username, email, full_name, phone, age, gender, 
                        preferred_language, created_at, last_login 
                 FROM users 
                 WHERE id = ?`,
                [req.user.userId]
            );

            console.log('✅ Profile updated for user:', req.user.username);
            return successResponse(res, updatedProfile.data, 'Profile updated successfully');
        } catch (error) {
            console.error('❌ Profile update error:', error.message);
            next(error);
        }
    }
);

// ============================================
// GET ALL USERS (Admin only - for future use)
// GET /api/users?limit=10
// ============================================
router.get('/', async (req, res, next) => {
    try {
        const { limit = 10 } = req.query;

        const users = await executeQuery(
            `SELECT id, username, email, full_name, created_at, last_login 
             FROM users 
             ORDER BY created_at DESC 
             LIMIT ?`,
            [parseInt(limit)]
        );

        return successResponse(res, users.data, 'Users retrieved successfully');
    } catch (error) {
        next(error);
    }
});

module.exports = router;
