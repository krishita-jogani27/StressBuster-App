// Resource Routes
// Psychoeducation resource hub endpoints
// Author: StressBuster Team

const express = require('express');
const router = express.Router();
const { executeQuery, getOne } = require('../config/database');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');

// ============================================
// GET ALL RESOURCE CATEGORIES
// GET /api/resources/categories
// ============================================
router.get('/categories', async (req, res, next) => {
    try {
        const result = await executeQuery(
            `SELECT id, name, description, icon 
       FROM resource_categories 
       ORDER BY display_order ASC`
        );

        if (!result.success) {
            return errorResponse(res, 'Failed to fetch categories', 500);
        }

        return successResponse(res, result.data, 'Categories retrieved successfully');

    } catch (error) {
        next(error);
    }
});

// ============================================
// GET ALL RESOURCES (with filters)
// GET /api/resources
// Query params: category, type, language, featured, page, limit
// ============================================
router.get('/', async (req, res, next) => {
    try {
        const { category, type, language, featured, page = 1, limit = 10 } = req.query;

        let query = `SELECT r.id, r.title, r.description, r.resource_type, r.file_url, 
                        r.thumbnail_url, r.duration_seconds, r.language, r.tags, 
                        r.view_count, r.is_featured, c.name as category_name
                 FROM resources r
                 LEFT JOIN resource_categories c ON r.category_id = c.id
                 WHERE r.is_active = TRUE`;

        const params = [];

        // Apply filters
        if (category) {
            query += ' AND r.category_id = ?';
            params.push(category);
        }

        if (type) {
            query += ' AND r.resource_type = ?';
            params.push(type);
        }

        if (language) {
            query += ' AND r.language = ?';
            params.push(language);
        }

        if (featured === 'true') {
            query += ' AND r.is_featured = TRUE';
        }

        // Get total count
        const countQuery = query.replace('SELECT r.id, r.title, r.description, r.resource_type, r.file_url, r.thumbnail_url, r.duration_seconds, r.language, r.tags, r.view_count, r.is_featured, c.name as category_name', 'SELECT COUNT(*) as total');
        const countResult = await executeQuery(countQuery, params);
        const total = countResult.data[0].total;

        // Add pagination
        const offset = (page - 1) * limit;
        query += ' ORDER BY r.is_featured DESC, r.view_count DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const result = await executeQuery(query, params);

        if (!result.success) {
            return errorResponse(res, 'Failed to fetch resources', 500);
        }

        return paginatedResponse(res, result.data, page, limit, total, 'Resources retrieved successfully');

    } catch (error) {
        next(error);
    }
});

// ============================================
// GET SINGLE RESOURCE
// GET /api/resources/:id
// ============================================
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await getOne(
            `SELECT r.*, c.name as category_name
       FROM resources r
       LEFT JOIN resource_categories c ON r.category_id = c.id
       WHERE r.id = ? AND r.is_active = TRUE`,
            [id]
        );

        if (!result.data) {
            return errorResponse(res, 'Resource not found', 404);
        }

        // Increment view count
        await executeQuery('UPDATE resources SET view_count = view_count + 1 WHERE id = ?', [id]);

        return successResponse(res, result.data, 'Resource retrieved successfully');

    } catch (error) {
        next(error);
    }
});

// ============================================
// GET FEATURED RESOURCES
// GET /api/resources/featured/list
// ============================================
router.get('/featured/list', async (req, res, next) => {
    try {
        const result = await executeQuery(
            `SELECT r.id, r.title, r.description, r.resource_type, r.thumbnail_url, 
              r.duration_seconds, r.language, c.name as category_name
       FROM resources r
       LEFT JOIN resource_categories c ON r.category_id = c.id
       WHERE r.is_featured = TRUE AND r.is_active = TRUE
       ORDER BY r.view_count DESC
       LIMIT 6`
        );

        if (!result.success) {
            return errorResponse(res, 'Failed to fetch featured resources', 500);
        }

        return successResponse(res, result.data, 'Featured resources retrieved successfully');

    } catch (error) {
        next(error);
    }
});

module.exports = router;
