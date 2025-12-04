// Response Helper Utilities
// Standardized response formats for API endpoints
// Author: StressBuster Team

// Success response
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        status: 'success',
        message,
        data
    });
};

// Error response
const errorResponse = (res, message = 'Error occurred', statusCode = 500, errors = null) => {
    const response = {
        status: 'error',
        message
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

// Paginated response
const paginatedResponse = (res, data, page, limit, total, message = 'Success') => {
    return res.status(200).json({
        status: 'success',
        message,
        data,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
};

module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse
};
