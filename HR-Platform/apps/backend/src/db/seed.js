import bcrypt from 'bcryptjs';
import { pool, testConnection } from '../config/database.js';

/**
 * Seed database with initial data
 * Creates SUPER_ADMIN and HR users for system initialization
 */
async function seed() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Test database connection
    await testConnection();

    const insertQuery = `
      INSERT INTO users (email, password_hash, role, first_name, last_name, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email, role;
    `;

    // 1. Create SUPER_ADMIN user
    const superAdminEmail = 'admin@hrplatform.com';
    const superAdminPassword = 'Admin123!@#';
    const adminHash = await bcrypt.hash(superAdminPassword, 12);
    await pool.query(insertQuery, [superAdminEmail, adminHash, 'SUPER_ADMIN', 'Super', 'Admin', true]);

    // 2. Create HR user
    const hrEmail = 'hr@hrplatform.com';
    const hrPassword = 'HR123!@#';
    const hrHash = await bcrypt.hash(hrPassword, 12);
    await pool.query(insertQuery, [hrEmail, hrHash, 'HR', 'HR', 'Manager', true]);

    console.log('✅ Accounts initialized successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Admin Email: ', superAdminEmail);
    console.log('🔑 Admin Pass:  ', superAdminPassword);
    console.log('📧 HR Email:    ', hrEmail);
    console.log('🔑 HR Pass:     ', hrPassword);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
