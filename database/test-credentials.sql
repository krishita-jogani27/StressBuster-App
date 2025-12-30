-- Test Credentials for StressBuster App
-- Run this script to add test users and admins to the database

USE stress_buster;

-- ============================================
-- CLEAR EXISTING TEST DATA
-- ============================================
DELETE FROM admin_users WHERE email IN ('admin@stressbuster.com', 'viewer@stressbuster.com');
DELETE FROM users WHERE email IN ('john@test.com', 'jane@test.com', 'test@test.com');

-- ============================================
-- ADD ADMIN USERS
-- ============================================

-- Super Admin
INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active) 
VALUES (
  'admin',
  'admin@stressbuster.com',
  '$2b$10$69yncYAUrgVX2h/2.Qb6YO506WH9B8D96oo1EBs8Pv.z5X6DGD9NnC',
  'System Administrator',
  'super_admin',
  TRUE
);

-- Viewer Admin (Read-only)
INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active) 
VALUES (
  'viewer',
  'viewer@stressbuster.com',
  '$2b$10$s2ZSoKiiFEx0jhU8Q1PKEOnf1WQVtC.WZ1gxXBY/nfcJdKU/uOJhS',
  'Dashboard Viewer',
  'viewer',
  TRUE
);

-- ============================================
-- ADD REGULAR USERS
-- ============================================

-- User 1: John Doe
INSERT INTO users (username, email, password_hash, full_name, phone, age, gender, preferred_language, is_active) 
VALUES (
  'john_doe',
  'john@test.com',
  '$2b$10$OwoXQNqXz7h3pGYUq9aJPONEOnf1WQVtC.WZ1gxXBY/nfcJdKU/uOJhS',
  'John Doe',
  '+919876543210',
  25,
  'male',
  'en',
  TRUE
);

-- User 2: Jane Smith
INSERT INTO users (username, email, password_hash, full_name, phone, age, gender, preferred_language, is_active) 
VALUES (
  'jane_smith',
  'jane@test.com',
  '$2b$10$OwoXQNqXz7h3pGYUq9aJPONEOnf1WQVtC.WZ1gxXBY/nfcJdKU/uOJhS',
  'Jane Smith',
  '+919876543211',
  28,
  'female',
  'en',
  TRUE
);

-- User 3: Test User
INSERT INTO users (username, email, password_hash, full_name, preferred_language, is_active) 
VALUES (
  'testuser',
  'test@test.com',
  '$2b$10$OwoXQNqXz7h3pGYUq9aJPONEOnf1WQVtC.WZ1gxXBY/nfcJdKU/uOJhS',
  'Test User',
  'en',
  TRUE
);

-- ============================================
-- VERIFY DATA
-- ============================================

SELECT '=== ADMIN USERS ===' AS '';
SELECT id, username, email, full_name, role, is_active 
FROM admin_users 
WHERE email IN ('admin@stressbuster.com', 'viewer@stressbuster.com');

SELECT '=== REGULAR USERS ===' AS '';
SELECT id, username, email, full_name, age, gender 
FROM users 
WHERE email IN ('john@test.com', 'jane@test.com', 'test@test.com');

SELECT '=== SUCCESS ===' AS '';
SELECT 'Test credentials created successfully!' AS status;
