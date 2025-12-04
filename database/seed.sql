-- StressBuster App - Seed Data
-- This file populates the database with dummy data for testing
-- Run this after schema.sql

USE stress_buster;

-- ============================================
-- SEED USERS
-- Password for all test users: "Test@123" (hashed with bcrypt)
-- ============================================
INSERT INTO users (username, email, password_hash, full_name, phone, age, gender, preferred_language, is_anonymous) VALUES
('john_doe', 'john@example.com', '$2b$10$rZ7qJ9K5xYxYxYxYxYxYxOe7qJ9K5xYxYxYxYxYxYxOe7qJ9K5xYx', 'John Doe', '+919876543210', 25, 'male', 'en', FALSE),
('jane_smith', 'jane@example.com', '$2b$10$rZ7qJ9K5xYxYxYxYxYxYxOe7qJ9K5xYxYxYxYxYxYxOe7qJ9K5xYx', 'Jane Smith', '+919876543211', 28, 'female', 'en', FALSE),
('anonymous_user', 'anon@example.com', '$2b$10$rZ7qJ9K5xYxYxYxYxYxYxOe7qJ9K5xYxYxYxYxYxYxOe7qJ9K5xYx', 'Anonymous User', NULL, NULL, 'prefer_not_to_say', 'en', TRUE),
('raj_kumar', 'raj@example.com', '$2b$10$rZ7qJ9K5xYxYxYxYxYxYxOe7qJ9K5xYxYxYxYxYxYxOe7qJ9K5xYx', 'Raj Kumar', '+919876543212', 30, 'male', 'hi', FALSE),
('priya_sharma', 'priya@example.com', '$2b$10$rZ7qJ9K5xYxYxYxYxYxYxOe7qJ9K5xYxYxYxYxYxYxOe7qJ9K5xYx', 'Priya Sharma', '+919876543213', 24, 'female', 'hi', FALSE);

-- ============================================
-- SEED COUNSELORS
-- ============================================
INSERT INTO counselors (name, specialization, qualification, experience_years, email, phone, available_days, available_time_start, available_time_end, is_active, rating, total_sessions) VALUES
('Dr. Sarah Johnson', 'Anxiety & Depression', 'PhD in Clinical Psychology', 10, 'sarah.j@counseling.com', '+919123456780', '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]', '09:00:00', '17:00:00', TRUE, 4.8, 150),
('Dr. Michael Chen', 'Stress Management', 'MD Psychiatry', 8, 'michael.c@counseling.com', '+919123456781', '["Monday", "Wednesday", "Friday"]', '10:00:00', '18:00:00', TRUE, 4.6, 120),
('Dr. Anita Desai', 'Relationship Counseling', 'MA Psychology, Licensed Therapist', 12, 'anita.d@counseling.com', '+919123456782', '["Tuesday", "Thursday", "Saturday"]', '11:00:00', '19:00:00', TRUE, 4.9, 200),
('Dr. Rahul Mehta', 'Youth & Student Counseling', 'PhD Psychology', 6, 'rahul.m@counseling.com', '+919123456783', '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]', '14:00:00', '20:00:00', TRUE, 4.7, 95),
('Dr. Kavita Patel', 'Trauma & PTSD', 'MD Psychiatry, Trauma Specialist', 15, 'kavita.p@counseling.com', '+919123456784', '["Wednesday", "Thursday", "Friday", "Saturday"]', '09:00:00', '16:00:00', TRUE, 4.9, 180);

-- ============================================
-- SEED APPOINTMENTS
-- ============================================
INSERT INTO appointments (user_id, counselor_id, appointment_date, appointment_time, duration_minutes, status, is_anonymous, notes) VALUES
(1, 1, '2025-12-05', '10:00:00', 60, 'confirmed', FALSE, 'First session - anxiety management'),
(2, 3, '2025-12-06', '14:00:00', 60, 'confirmed', FALSE, 'Relationship issues discussion'),
(3, 2, '2025-12-07', '11:00:00', 60, 'pending', TRUE, 'Anonymous session - stress relief'),
(4, 4, '2025-12-08', '15:00:00', 60, 'confirmed', FALSE, 'Career stress counseling'),
(5, 5, '2025-12-09', '10:00:00', 60, 'pending', FALSE, 'Past trauma discussion'),
(1, 2, '2025-12-10', '16:00:00', 60, 'confirmed', FALSE, 'Follow-up session'),
(2, 1, '2025-12-04', '09:00:00', 60, 'completed', FALSE, 'Initial consultation - completed');

-- ============================================
-- SEED CHATBOT CONVERSATIONS
-- ============================================
INSERT INTO chatbot_conversations (user_id, session_id, message, sender, intent, sentiment, response_time_ms) VALUES
(1, 'session_001', 'I am feeling very anxious about my exams', 'user', 'emotional_support', 'negative', 150),
(1, 'session_001', 'I understand you are feeling anxious. Let me share some coping strategies that might help...', 'bot', 'coping_strategy', 'neutral', 500),
(2, 'session_002', 'Can you help me with stress management techniques?', 'user', 'coping_strategy', 'neutral', 120),
(2, 'session_002', 'Of course! Here are some effective stress management techniques: deep breathing, meditation, exercise...', 'bot', 'coping_strategy', 'positive', 450),
(3, 'session_003', 'I need to talk to someone urgently', 'user', 'referral', 'negative', 100),
(3, 'session_003', 'I am here to help. If you need immediate assistance, here are some helpline numbers...', 'bot', 'referral', 'neutral', 300),
(4, 'session_004', 'How can I improve my sleep?', 'user', 'coping_strategy', 'neutral', 140),
(4, 'session_004', 'Good sleep hygiene is important. Try these tips: maintain a regular schedule, avoid screens before bed...', 'bot', 'coping_strategy', 'positive', 520);

-- ============================================
-- SEED RESOURCE CATEGORIES
-- ============================================
INSERT INTO resource_categories (name, description, icon, display_order) VALUES
('Stress Management', 'Learn techniques to manage and reduce stress', 'stress-icon', 1),
('Anxiety Relief', 'Resources for understanding and managing anxiety', 'anxiety-icon', 2),
('Meditation & Mindfulness', 'Guided meditation and mindfulness practices', 'meditation-icon', 3),
('Sleep & Relaxation', 'Improve sleep quality and relaxation techniques', 'sleep-icon', 4),
('Positive Psychology', 'Build resilience and positive mental health', 'positive-icon', 5),
('Crisis Support', 'Emergency resources and crisis management', 'crisis-icon', 6);

-- ============================================
-- SEED RESOURCES
-- ============================================
INSERT INTO resources (category_id, title, description, resource_type, file_url, thumbnail_url, duration_seconds, language, tags, view_count, download_count, is_featured, is_active) VALUES
-- Videos
(1, 'Understanding Stress: A Complete Guide', 'Learn what stress is and how it affects your body and mind', 'video', 'https://example.com/videos/stress-guide.mp4', 'https://example.com/thumbs/stress-guide.jpg', 600, 'en', '["stress", "education", "beginner"]', 1250, 0, TRUE, TRUE),
(2, 'Breathing Exercises for Anxiety', 'Simple breathing techniques to calm anxiety', 'video', 'https://example.com/videos/breathing-anxiety.mp4', 'https://example.com/thumbs/breathing.jpg', 420, 'en', '["anxiety", "breathing", "exercise"]', 890, 0, TRUE, TRUE),
(3, '10-Minute Guided Meditation', 'A peaceful guided meditation for beginners', 'video', 'https://example.com/videos/meditation-10min.mp4', 'https://example.com/thumbs/meditation.jpg', 600, 'en', '["meditation", "mindfulness", "beginner"]', 2100, 0, TRUE, TRUE),
(1, 'तनाव प्रबंधन तकनीक', 'तनाव को कम करने के लिए प्रभावी तकनीकें', 'video', 'https://example.com/videos/stress-hindi.mp4', 'https://example.com/thumbs/stress-hindi.jpg', 480, 'hi', '["stress", "hindi", "techniques"]', 650, 0, FALSE, TRUE),

-- Audio
(4, 'Deep Sleep Relaxation Audio', 'Calming sounds to help you fall asleep', 'audio', 'https://example.com/audio/sleep-relaxation.mp3', 'https://example.com/thumbs/sleep-audio.jpg', 1800, 'en', '["sleep", "relaxation", "calming"]', 1500, 450, TRUE, TRUE),
(3, 'Mindfulness Meditation - 15 Minutes', 'Guided mindfulness practice', 'audio', 'https://example.com/audio/mindfulness-15.mp3', 'https://example.com/thumbs/mindfulness.jpg', 900, 'en', '["mindfulness", "meditation", "guided"]', 980, 320, FALSE, TRUE),
(4, 'Ocean Waves - Sleep Sounds', 'Natural ocean sounds for relaxation', 'audio', 'https://example.com/audio/ocean-waves.mp3', 'https://example.com/thumbs/ocean.jpg', 3600, 'en', '["sleep", "nature", "sounds"]', 2300, 780, TRUE, TRUE),
(3, 'ध्यान संगीत - शांति', 'शांतिपूर्ण ध्यान के लिए संगीत', 'audio', 'https://example.com/audio/dhyan-hindi.mp3', 'https://example.com/thumbs/dhyan.jpg', 1200, 'hi', '["meditation", "hindi", "music"]', 420, 150, FALSE, TRUE),

-- PDFs
(1, 'Stress Management Workbook', 'A comprehensive workbook with exercises and strategies', 'pdf', 'https://example.com/pdfs/stress-workbook.pdf', 'https://example.com/thumbs/workbook.jpg', NULL, 'en', '["stress", "workbook", "exercises"]', 560, 340, FALSE, TRUE),
(2, 'Understanding Anxiety Disorders', 'Educational guide about different types of anxiety', 'pdf', 'https://example.com/pdfs/anxiety-guide.pdf', 'https://example.com/thumbs/anxiety-pdf.jpg', NULL, 'en', '["anxiety", "education", "guide"]', 720, 420, TRUE, TRUE),
(5, 'Building Resilience: A Practical Guide', 'Learn how to build mental resilience', 'pdf', 'https://example.com/pdfs/resilience.pdf', 'https://example.com/thumbs/resilience.jpg', NULL, 'en', '["resilience", "positive", "guide"]', 450, 280, FALSE, TRUE),
(6, 'Crisis Management Resources', 'Emergency contacts and crisis intervention techniques', 'pdf', 'https://example.com/pdfs/crisis-resources.pdf', 'https://example.com/thumbs/crisis.jpg', NULL, 'en', '["crisis", "emergency", "resources"]', 890, 520, TRUE, TRUE);

-- ============================================
-- SEED HELPLINE NUMBERS
-- ============================================
INSERT INTO helpline_numbers (name, phone, description, category, available_hours, language_support, is_toll_free, country_code, display_order, is_active) VALUES
('National Mental Health Helpline', '1800-599-0019', 'Free mental health support and counseling', 'mental_health', '24/7', 'English, Hindi, Tamil, Telugu', TRUE, '+91', 1, TRUE),
('AASRA Suicide Prevention', '9820466726', 'Suicide prevention and emotional support', 'suicide_prevention', '24/7', 'English, Hindi', FALSE, '+91', 2, TRUE),
('Vandrevala Foundation', '1860-2662-345', 'Mental health support and crisis intervention', 'mental_health', '24/7', 'English, Hindi, Multiple Regional', TRUE, '+91', 3, TRUE),
('iCall Psychosocial Helpline', '9152987821', 'Professional counseling service', 'mental_health', 'Mon-Sat: 8 AM - 10 PM', 'English, Hindi, Marathi', FALSE, '+91', 4, TRUE),
('Snehi Foundation', '9899-588-211', 'Emotional support for those in distress', 'emotional_support', '24/7', 'English, Hindi', FALSE, '+91', 5, TRUE),
('Connecting NGO', '9922-001-122', 'Mental health support for youth', 'mental_health', '12 PM - 8 PM', 'English, Hindi', FALSE, '+91', 6, TRUE);

-- ============================================
-- SEED GAME SESSIONS
-- ============================================
INSERT INTO game_sessions (user_id, game_type, duration_seconds, score, completed, stress_level_before, stress_level_after) VALUES
(1, 'breathing', 300, 100, TRUE, 7, 4),
(1, 'tap_to_relax', 180, 85, TRUE, 6, 3),
(2, 'memory_puzzle', 420, 95, TRUE, 8, 5),
(3, 'breathing', 240, 100, TRUE, 9, 6),
(4, 'calm_timer', 600, 100, TRUE, 7, 3),
(5, 'tap_to_relax', 150, 70, TRUE, 5, 2),
(1, 'memory_puzzle', 480, 90, TRUE, 6, 4),
(2, 'breathing', 360, 100, TRUE, 8, 4);

-- ============================================
-- SEED ADMIN USERS
-- Password for all admin users: "Admin@123" (hashed with bcrypt)
-- ============================================
INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active) VALUES
('admin', 'admin@stressbuster.com', '$2b$10$rZ7qJ9K5xYxYxYxYxYxYxOe7qJ9K5xYxYxYxYxYxYxOe7qJ9K5xYx', 'System Administrator', 'super_admin', TRUE),
('viewer', 'viewer@stressbuster.com', '$2b$10$rZ7qJ9K5xYxYxYxYxYxYxOe7qJ9K5xYxYxYxYxYxYxOe7qJ9K5xYx', 'Dashboard Viewer', 'viewer', TRUE);

-- ============================================
-- SEED FEEDBACK
-- ============================================
INSERT INTO feedback (user_id, feedback_type, related_id, rating, comment, is_anonymous) VALUES
(1, 'counselor', 1, 5, 'Dr. Sarah was very helpful and understanding', FALSE),
(2, 'app', NULL, 4, 'Great app, helped me manage my stress', FALSE),
(3, 'resource', 3, 5, 'The meditation video was very calming', TRUE),
(4, 'game', NULL, 4, 'Breathing game really helps me relax', FALSE),
(5, 'counselor', 5, 5, 'Excellent counselor, very professional', FALSE);

-- ============================================
-- SEED NOTIFICATIONS
-- ============================================
INSERT INTO notifications (user_id, title, message, notification_type, is_read) VALUES
(1, 'Appointment Confirmed', 'Your appointment with Dr. Sarah Johnson on Dec 5 at 10:00 AM is confirmed', 'appointment', FALSE),
(2, 'New Resource Available', 'Check out our new meditation guide in the Resource Hub', 'resource', FALSE),
(4, 'Appointment Reminder', 'You have an appointment tomorrow at 3:00 PM with Dr. Rahul Mehta', 'reminder', FALSE),
(1, 'Daily Tip', 'Remember to practice deep breathing for 5 minutes today', 'system', TRUE);

-- ============================================
-- Success message
-- ============================================
SELECT 'Seed data inserted successfully!' as Status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_counselors FROM counselors;
SELECT COUNT(*) as total_appointments FROM appointments;
SELECT COUNT(*) as total_resources FROM resources;
