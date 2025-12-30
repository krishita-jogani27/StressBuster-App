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
            console.log('📝 Registration attempt:', { email: req.body.email, username: req.body.username });
            const { username, email, password, full_name, phone, age, gender, preferred_language } = req.body;

            // Check if user already exists
            const existingUser = await getOne(
                'SELECT id FROM users WHERE email = ? OR username = ?',
                [email, username]
            );

            if (existingUser.data) {
                console.log('❌ Registration failed: User already exists');
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
                console.log('❌ Registration failed: Database error');
                return errorResponse(res, 'Failed to create user', 500);
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: result.insertId, username, email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            console.log('✅ Registration successful for user:', username);
            return successResponse(res, {
                userId: result.insertId,
                username,
                email,
                token
            }, 'User registered successfully', 201);

        } catch (error) {
            console.error('❌ Registration error:', error.message);
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
            console.log('🔐 Login attempt:', { email: req.body.email });
            const { email, password } = req.body;

            // First, try to find user in regular users table
            const userResult = await getOne(
                'SELECT id, username, email, password_hash, full_name, is_active FROM users WHERE email = ?',
                [email]
            );

            let user = null;
            let isAdmin = false;
            let role = null;
            let tableName = 'users';

            if (userResult.data) {
                user = userResult.data;
                console.log('✅ User found in users table');
            } else {
                // If not found in users, check admin_users table
                const adminResult = await getOne(
                    'SELECT id, username, email, password_hash, full_name, role, is_active FROM admin_users WHERE email = ?',
                    [email]
                );

                if (adminResult.data) {
                    user = adminResult.data;
                    isAdmin = true;
                    role = adminResult.data.role;
                    tableName = 'admin_users';
                    console.log('✅ User found in admin_users table');
                }
            }

            // If user not found in either table
            if (!user) {
                console.log('❌ Login failed: User not found');
                return errorResponse(res, 'Invalid email or password', 401);
            }

            // Check if user is active
            if (!user.is_active) {
                console.log('❌ Login failed: Account deactivated');
                return errorResponse(res, 'Account is deactivated', 403);
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);

            if (!isPasswordValid) {
                console.log('❌ Login failed: Invalid password');
                return errorResponse(res, 'Invalid email or password', 401);
            }

            // Update last login in appropriate table
            await executeQuery(`UPDATE ${tableName} SET last_login = NOW() WHERE id = ?`, [user.id]);

            // Generate JWT token with role information
            const tokenPayload = {
                userId: user.id,
                username: user.username,
                email: user.email,
                isAdmin
            };

            if (isAdmin) {
                tokenPayload.role = role;
                tokenPayload.adminId = user.id;
            }

            const token = jwt.sign(
                tokenPayload,
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Prepare response data
            const responseData = {
                userId: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                isAdmin,
                token
            };

            if (isAdmin) {
                responseData.role = role;
            }

            console.log('✅ Login successful for user:', user.username);
            return successResponse(res, responseData, 'Login successful');

        } catch (error) {
            console.error('❌ Login error:', error.message);
            next(error);
        }
    }
);

module.exports = router;
