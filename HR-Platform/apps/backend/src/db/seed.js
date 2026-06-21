import bcrypt from 'bcryptjs';
import { pool, testConnection } from '../config/database.js';

/**
 * Seed database with initial data
 * Creates a SUPER_ADMIN user for system initialization
 */
async function seed() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Test database connection
    await testConnection();

    // Check if SUPER_ADMIN already exists
    const checkQuery = `
      SELECT id, email FROM users WHERE role = 'SUPER_ADMIN' LIMIT 1;
    `;
    const checkResult = await pool.query(checkQuery);

    if (checkResult.rows.length > 0) {
      console.log('⚠️  SUPER_ADMIN already exists:');
      console.log(`   Email: ${checkResult.rows[0].email}`);
      console.log(`   ID: ${checkResult.rows[0].id}`);
      console.log('\n✅ Seeding skipped - database already initialized\n');
      return;
    }

    // Create SUPER_ADMIN user
    const superAdminEmail = 'admin@hrplatform.com';
    const superAdminPassword = 'Admin123!@#';
    const passwordHash = await bcrypt.hash(superAdminPassword, 12);

    const insertQuery = `
      INSERT INTO users (email, password_hash, role, first_name, last_name, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, role;
    `;

    const result = await pool.query(insertQuery, [
      superAdminEmail,
      passwordHash,
      'SUPER_ADMIN',
      'Super',
      'Admin',
      true,
    ]);

    console.log('✅ SUPER_ADMIN created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ', superAdminEmail);
    console.log('🔑 Password: ', superAdminPassword);
    console.log('👤 Role:     ', result.rows[0].role);
    console.log('🆔 ID:       ', result.rows[0].id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANT: Please change the password after first login!\n');

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run seed
seed();
