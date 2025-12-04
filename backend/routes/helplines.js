// Helpline Routes
// Emergency helpline numbers
// Author: StressBuster Team

const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// ============================================
// GET ALL HELPLINE NUMBERS
// GET /api/helplines
// ============================================
router.get('/', async (req, res, next) => {
    try {
        const result = await executeQuery(
            `SELECT id, name, phone, description, category, available_hours, 
              language_support, is_toll_free, country_code
       FROM helpline_numbers 
       WHERE is_active = TRUE
       ORDER BY display_order ASC`
        );

        if (!result.success) {
            return errorResponse(res, 'Failed to fetch helpline numbers', 500);
        }

        return successResponse(res, result.data, 'Helpline numbers retrieved successfully');

    } catch (error) {
        next(error);
    }
});

module.exports = router;
