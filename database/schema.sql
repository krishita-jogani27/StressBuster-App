-- StressBuster App - MySQL Database Schema
-- This schema creates all necessary tables for the mental health application
-- Author: AI Assistant
-- Date: 2025-12-02

-- Drop existing database if exists and create fresh
DROP DATABASE IF EXISTS stress_buster;
CREATE DATABASE stress_buster;
USE stress_buster;

-- ============================================
-- USERS TABLE
-- Stores user account information
-- ============================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    age INT,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    preferred_language VARCHAR(10) DEFAULT 'en',
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- COUNSELORS TABLE
-- Stores counselor/therapist information
-- ============================================
CREATE TABLE counselors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    qualification VARCHAR(255),
    experience_years INT,
    email VARCHAR(255),
    phone VARCHAR(20),
    available_days JSON, -- ["Monday", "Tuesday", "Wednesday"]
    available_time_start TIME,
    available_time_end TIME,
    is_active BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_sessions INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- APPOINTMENTS TABLE
-- Stores booking information for counseling sessions
-- ============================================
CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    counselor_id INT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show') DEFAULT 'pending',
    is_anonymous BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (counselor_id) REFERENCES counselors(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_counselor (counselor_id),
    INDEX idx_date (appointment_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CHATBOT_CONVERSATIONS TABLE
-- Stores chat history and AI interactions
-- ============================================
CREATE TABLE chatbot_conversations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    session_id VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    sender ENUM('user', 'bot') NOT NULL,
    intent VARCHAR(100), -- e.g., 'coping_strategy', 'referral', 'emotional_support'
    sentiment VARCHAR(50), -- e.g., 'positive', 'negative', 'neutral'
    response_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_session (session_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- RESOURCE_CATEGORIES TABLE
-- Categories for organizing educational resources
-- ============================================
CREATE TABLE resource_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- RESOURCES TABLE
-- Stores videos, PDFs, audio files for psychoeducation
-- ============================================
CREATE TABLE resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type ENUM('video', 'pdf', 'audio', 'article') NOT NULL,
    file_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    duration_seconds INT, -- for videos and audio
    language VARCHAR(10) DEFAULT 'en',
    tags JSON, -- ["anxiety", "stress", "meditation"]
    view_count INT DEFAULT 0,
    download_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES resource_categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_type (resource_type),
    INDEX idx_language (language),
    INDEX idx_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- HELPLINE_NUMBERS TABLE
-- Emergency and support helpline information
-- ============================================
CREATE TABLE helpline_numbers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- e.g., 'mental_health', 'suicide_prevention', 'domestic_violence'
    available_hours VARCHAR(100), -- e.g., '24/7', '9 AM - 5 PM'
    language_support VARCHAR(255), -- e.g., 'English, Hindi, Tamil'
    is_toll_free BOOLEAN DEFAULT FALSE,
    country_code VARCHAR(5) DEFAULT '+91',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- GAME_SESSIONS TABLE
-- Tracks user engagement with stress-buster games
-- ============================================
CREATE TABLE game_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    game_type ENUM('breathing', 'tap_to_relax', 'memory_puzzle', 'calm_timer') NOT NULL,
    duration_seconds INT,
    score INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    stress_level_before INT, -- 1-10 scale
    stress_level_after INT, -- 1-10 scale
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_game_type (game_type),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ADMIN_USERS TABLE
-- Admin dashboard access control
-- ============================================
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role ENUM('super_admin', 'admin', 'viewer') DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- FEEDBACK TABLE
-- User feedback and ratings
-- ============================================
CREATE TABLE feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    feedback_type ENUM('app', 'counselor', 'resource', 'game') NOT NULL,
    related_id INT, -- ID of counselor, resource, or game
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_type (feedback_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- NOTIFICATIONS TABLE
-- System notifications for users
-- ============================================
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('appointment', 'reminder', 'system', 'resource') DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Create a view for analytics dashboard
-- ============================================
CREATE VIEW dashboard_analytics AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE is_active = TRUE) as total_active_users,
    (SELECT COUNT(*) FROM chatbot_conversations WHERE DATE(created_at) = CURDATE()) as today_chat_queries,
    (SELECT COUNT(*) FROM appointments WHERE status = 'confirmed') as confirmed_appointments,
    (SELECT COUNT(*) FROM game_sessions WHERE DATE(created_at) = CURDATE()) as today_game_sessions,
    (SELECT COUNT(*) FROM resources WHERE is_active = TRUE) as total_resources;

-- ============================================
-- Success message
-- ============================================
SELECT 'Database schema created successfully!' as Status;
