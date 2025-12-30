// Express Server Entry Point
// Main server file for StressBuster Backend API
// Author: StressBuster Team

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { testConnection } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const chatbotRoutes = require('./routes/chatbot');
const appointmentRoutes = require('./routes/appointments');
const resourceRoutes = require('./routes/resources');
const gameRoutes = require('./routes/games');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const helplineRoutes = require('./routes/helplines');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Enable CORS for cross-origin requests
// In development, allow all origins for easier testing
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? [
            process.env.FRONTEND_URL || 'http://localhost:3000',
            process.env.MOBILE_APP_URL || 'http://localhost:8081'
        ]
        : true, // Allow all origins in development
    credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// HTTP request logger (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Add custom request logging for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    if (req.method === 'POST' && req.path.includes('/auth/')) {
        console.log('Request body:', { ...req.body, password: '***' }); // Hide password in logs
    }
    next();
});

// ============================================
// API ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'StressBuster API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Mount route handlers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/helplines', helplineRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`
    });
});

// Global error handling middleware (must be last)
app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

const startServer = async () => {
    try {
        // Test database connection before starting server
        const dbConnected = await testConnection();

        if (!dbConnected) {
            console.error('⚠️  Server starting without database connection');
            console.error('Please configure your database settings in .env file');
        }

        // Start listening for requests
        app.listen(PORT, '0.0.0.0', () => {
            console.log('='.repeat(50));
            console.log('🚀 StressBuster Backend API Server');
            console.log('='.repeat(50));
            console.log(`📡 Server running on port: ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 API URL: http://localhost:${PORT}/api`);
            console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
            console.log('='.repeat(50));
            console.log('Available endpoints:');
            console.log('  - POST   /api/auth/register');
            console.log('  - POST   /api/auth/login');
            console.log('  - GET    /api/users/profile');
            console.log('  - PUT    /api/users/profile');
            console.log('  - GET    /api/chatbot/conversation/:sessionId');
            console.log('  - POST   /api/chatbot/message');
            console.log('  - GET    /api/appointments');
            console.log('  - POST   /api/appointments');
            console.log('  - GET    /api/resources');
            console.log('  - GET    /api/games/sessions');
            console.log('  - POST   /api/games/sessions');
            console.log('  - GET    /api/admin/analytics');
            console.log('  - GET    /api/helplines');
            console.log('='.repeat(50));
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Close server & exit process
    process.exit(1);
});

// Start the server
startServer();

module.exports = app;
