-- Add Admin User for Testing
-- Run this script to add an admin user to the database
-- Email: admin@stressbuster.com
-- Password: Admin@123

USE stress_buster;

-- Delete existing admin if exists
DELETE FROM admin_users WHERE email = 'admin@stressbuster.com';

-- Insert admin user with proper password hash
INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active) 
VALUES (
  'admin',
  'admin@stressbuster.com',
  '$2b$10$69yncYAUrgVX2h/2.Qb6YO506WH9B8D96oo1EBs8Pv.z5X6DGD9NnC',
  'System Administrator',
  'super_admin',
  TRUE
);

-- Verify admin was created
SELECT id, username, email, full_name, role, is_active, created_at 
FROM admin_users 
WHERE email = 'admin@stressbuster.com';

-- Success message
SELECT 'Admin user created successfully!' AS status,
       'Email: admin@stressbuster.com' AS email,
       'Password: Admin@123' AS password;
