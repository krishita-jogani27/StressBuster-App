// Authentication Routes
// Handles user registration and login
// Author: StressBuster Team

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const { executeQuery, getOne, insert } = require('../config/database');
const validate = require('../middleware/validator');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// ============================================
// REGISTER NEW USER
// POST /api/auth/register
// ============================================
router.post('/register',
    [
        body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('full_name').optional().trim(),
        validate
    ],
    async (req, res, next) => {
        try {
            const { username, email, password, full_name, phone, age, gender, preferred_language } = req.body;

            // Check if user already exists
            const existingUser = await getOne(
                'SELECT id FROM users WHERE email = ? OR username = ?',
                [email, username]
            );

            if (existingUser.data) {
                return errorResponse(res, 'User with this email or username already exists', 409);
            }

            // Hash password
            const password_hash = await bcrypt.hash(password, 10);

            // Insert new user
            const result = await insert(
                `INSERT INTO users (username, email, password_hash, full_name, phone, age, gender, preferred_language) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [username, email, password_hash, full_name || null, phone || null, age || null, gender || null, preferred_language || 'en']
            );

            if (!result.success) {
                return errorResponse(res, 'Failed to create user', 500);
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: result.insertId, username, email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            return successResponse(res, {
                userId: result.insertId,
                username,
                email,
                token
            }, 'User registered successfully', 201);

        } catch (error) {
            next(error);
        }
    }
);

// ============================================
// LOGIN USER
// POST /api/auth/login
// ============================================
router.post('/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
        validate
    ],
    async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Find user
            const userResult = await getOne(
                'SELECT id, username, email, password_hash, full_name, is_active FROM users WHERE email = ?',
                [email]
            );

            if (!userResult.data) {
                return errorResponse(res, 'Invalid email or password', 401);
            }

            const user = userResult.data;

            // Check if user is active
            if (!user.is_active) {
                return errorResponse(res, 'Account is deactivated', 403);
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);

            if (!isPasswordValid) {
                return errorResponse(res, 'Invalid email or password', 401);
            }

            // Update last login
            await executeQuery('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, username: user.username, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            return successResponse(res, {
                userId: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                token
            }, 'Login successful');

        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
