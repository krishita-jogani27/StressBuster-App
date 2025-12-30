// Seed counselors data
// Run this script to add sample counselors to the database

const { executeQuery } = require('./config/database');

const seedCounselors = async () => {
    try {
        console.log('🌱 Seeding counselors data...');

        // Check if counselors already exist
        const existing = await executeQuery('SELECT COUNT(*) as count FROM counselors');

        if (existing.data[0].count > 0) {
            console.log(`ℹ️  Database already has ${existing.data[0].count} counselors`);
            console.log('Skipping seed to avoid duplicates');
            process.exit(0);
        }

        // Insert sample counselors
        const counselors = [
            {
                name: 'Dr. Sarah Johnson',
                specialization: 'Anxiety & Depression',
                qualification: 'PhD in Clinical Psychology',
                experience_years: 12,
                email: 'sarah.johnson@stressbuster.com',
                phone: '+91-9876543210',
                available_days: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
                available_time_start: '09:00:00',
                available_time_end: '17:00:00',
                rating: 4.8
            },
            {
                name: 'Dr. Michael Chen',
                specialization: 'Stress Management',
                qualification: 'MD Psychiatry',
                experience_years: 8,
                email: 'michael.chen@stressbuster.com',
                phone: '+91-9876543211',
                available_days: JSON.stringify(['Monday', 'Wednesday', 'Friday']),
                available_time_start: '10:00:00',
                available_time_end: '18:00:00',
                rating: 4.7
            },
            {
                name: 'Dr. Priya Sharma',
                specialization: 'Relationship Counseling',
                qualification: 'MSc Psychology, Licensed Therapist',
                experience_years: 10,
                email: 'priya.sharma@stressbuster.com',
                phone: '+91-9876543212',
                available_days: JSON.stringify(['Tuesday', 'Thursday', 'Saturday']),
                available_time_start: '09:00:00',
                available_time_end: '16:00:00',
                rating: 4.9
            },
            {
                name: 'Dr. James Williams',
                specialization: 'Trauma & PTSD',
                qualification: 'PhD Clinical Psychology',
                experience_years: 15,
                email: 'james.williams@stressbuster.com',
                phone: '+91-9876543213',
                available_days: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
                available_time_start: '08:00:00',
                available_time_end: '16:00:00',
                rating: 4.6
            },
            {
                name: 'Dr. Anita Patel',
                specialization: 'Child & Adolescent Therapy',
                qualification: 'MD Child Psychiatry',
                experience_years: 7,
                email: 'anita.patel@stressbuster.com',
                phone: '+91-9876543214',
                available_days: JSON.stringify(['Monday', 'Wednesday', 'Friday', 'Saturday']),
                available_time_start: '10:00:00',
                available_time_end: '17:00:00',
                rating: 4.8
            }
        ];

        for (const counselor of counselors) {
            await executeQuery(
                `INSERT INTO counselors (name, specialization, qualification, experience_years, email, phone, 
                 available_days, available_time_start, available_time_end, rating) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    counselor.name,
                    counselor.specialization,
                    counselor.qualification,
                    counselor.experience_years,
                    counselor.email,
                    counselor.phone,
                    counselor.available_days,
                    counselor.available_time_start,
                    counselor.available_time_end,
                    counselor.rating
                ]
            );
            console.log(`✅ Added counselor: ${counselor.name}`);
        }

        console.log('\n🎉 Successfully seeded 5 counselors!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding counselors:', error.message);
        process.exit(1);
    }
};

seedCounselors();
