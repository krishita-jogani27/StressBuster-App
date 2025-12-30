-- Seed data for counselors
-- This adds sample counselors to the database

USE stress_buster;

-- Insert sample counselors
INSERT INTO counselors (name, specialization, qualification, experience_years, email, phone, available_days, available_time_start, available_time_end, rating) VALUES
('Dr. Sarah Johnson', 'Anxiety & Depression', 'PhD in Clinical Psychology', 12, 'sarah.johnson@stressbuster.com', '+91-9876543210', '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]', '09:00:00', '17:00:00', 4.8),
('Dr. Michael Chen', 'Stress Management', 'MD Psychiatry', 8, 'michael.chen@stressbuster.com', '+91-9876543211', '["Monday", "Wednesday", "Friday"]', '10:00:00', '18:00:00', 4.7),
('Dr. Priya Sharma', 'Relationship Counseling', 'MSc Psychology, Licensed Therapist', 10, 'priya.sharma@stressbuster.com', '+91-9876543212', '["Tuesday", "Thursday", "Saturday"]', '09:00:00', '16:00:00', 4.9),
('Dr. James Williams', 'Trauma & PTSD', 'PhD Clinical Psychology', 15, 'james.williams@stressbuster.com', '+91-9876543213', '["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]', '08:00:00', '16:00:00', 4.6),
('Dr. Anita Patel', 'Child & Adolescent Therapy', 'MD Child Psychiatry', 7, 'anita.patel@stressbuster.com', '+91-9876543214', '["Monday", "Wednesday", "Friday", "Saturday"]', '10:00:00', '17:00:00', 4.8);

SELECT 'Counselors seeded successfully!' as Status;
SELECT COUNT(*) as total_counselors FROM counselors;
