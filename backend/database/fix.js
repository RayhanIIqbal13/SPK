const pool = require('./pool');
async function fix() {
  try {
    console.log('Adding password column to users table...');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255) DEFAULT \'password123\'');
    console.log('Successfully added password column!');
  } catch (err) {
    console.error('Error adding column:', err.message);
  } finally {
    process.exit(0);
  }
}
fix();
