const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function createMultipleAdmins() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'stress_buster'
        });

        // Admin credentials (before hashing)
        const admins = [
            {
                username: 'admin',
                email: 'admin@stressbuster.com',
                password: 'Admin@123',
                full_name: 'System Administrator',
                role: 'super_admin'
            },
            {
                username: 'john_admin',
                email: 'john.admin@stressbuster.com',
                password: 'Admin@123',
                full_name: 'John Anderson',
                role: 'admin'
            },
            {
                username: 'sarah_admin',
                email: 'sarah.admin@stressbuster.com',
                password: 'Admin@123',
                full_name: 'Sarah Williams',
                role: 'admin'
            },
            {
                username: 'viewer',
                email: 'viewer@stressbuster.com',
                password: 'Viewer@123',
                full_name: 'Dashboard Viewer',
                role: 'viewer'
            }
        ];

        console.log('🔐 Creating Admin Users...\n');
        console.log('='.repeat(60));

        // Clear existing admins
        await connection.execute('DELETE FROM admin_users');

        for (const admin of admins) {
            // Hash password
            const hash = await bcrypt.hash(admin.password, 10);

            // Insert admin
            await connection.execute(
                'INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
                [admin.username, admin.email, hash, admin.full_name, admin.role, 1]
            );

            console.log(`✅ Created: ${admin.full_name}`);
            console.log(`   Email: ${admin.email}`);
            console.log(`   Password: ${admin.password}`);
            console.log(`   Role: ${admin.role}`);
            console.log('-'.repeat(60));
        }

        // Verify all admins
        const [rows] = await connection.execute('SELECT id, username, email, full_name, role FROM admin_users');

        console.log('\n📊 Total Admins Created:', rows.length);
        console.log('='.repeat(60));

        await connection.end();

        console.log('\n✅ All admin users created successfully!');
        console.log('\n📝 CREDENTIALS SUMMARY:');
        console.log('='.repeat(60));
        admins.forEach(admin => {
            console.log(`${admin.full_name} (${admin.role})`);
            console.log(`  Email: ${admin.email}`);
            console.log(`  Password: ${admin.password}`);
            console.log('');
        });

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

createMultipleAdmins();
