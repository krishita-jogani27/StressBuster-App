const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function createAdminUser() {
    try {
        // Generate password hash
        const password = 'Admin@123';
        const hash = await bcrypt.hash(password, 10);

        console.log('Generated hash for password:', password);
        console.log('Hash:', hash);

        // Connect to database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'stress_buster'
        });

        // Delete existing admin
        await connection.execute(
            'DELETE FROM admin_users WHERE email = ?',
            ['admin@stressbuster.com']
        );

        // Insert new admin
        await connection.execute(
            'INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
            ['admin', 'admin@stressbuster.com', hash, 'System Administrator', 'super_admin', 1]
        );

        // Verify it was created
        const [rows] = await connection.execute(
            'SELECT id, username, email, role FROM admin_users WHERE email = ?',
            ['admin@stressbuster.com']
        );

        console.log('\n✅ Admin user created successfully!');
        console.log('User details:', rows[0]);

        // Test the password
        const [hashRows] = await connection.execute(
            'SELECT password_hash FROM admin_users WHERE email = ?',
            ['admin@stressbuster.com']
        );

        const isValid = await bcrypt.compare(password, hashRows[0].password_hash);
        console.log('\n✅ Password verification:', isValid ? 'SUCCESS' : 'FAILED');

        await connection.end();

        console.log('\n📧 Login credentials:');
        console.log('Email: admin@stressbuster.com');
        console.log('Password: Admin@123');

    } catch (error) {
        console.error('Error:', error);
    }
}

createAdminUser();
