const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function initDatabase() {
  // First connect without database to create it
  const adminPool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres'
  });

  try {
    // Check if database exists
    const dbCheck = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1", [process.env.DB_NAME]
    );

    if (dbCheck.rows.length === 0) {
      console.log(`Creating database "${process.env.DB_NAME}"...`);
      await adminPool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log('Database created successfully.');
    } else {
      console.log(`Database "${process.env.DB_NAME}" already exists.`);
    }
  } catch (err) {
    console.error('Error creating database:', err.message);
  } finally {
    await adminPool.end();
  }

  // Now connect to the actual database
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // Read and execute schema (skip CREATE DATABASE and \c lines)
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const filteredSchema = schemaSQL
      .split('\n')
      .filter(line => !line.startsWith('CREATE DATABASE') && !line.startsWith('\\c'))
      .join('\n');
    
    console.log('Creating tables...');
    await pool.query(filteredSchema);
    console.log('Tables created successfully.');

    // Check if data already exists
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count) > 0) {
      console.log('Data already exists. Skipping seed.');
    } else {
      // Read and execute seed
      const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
      console.log('Seeding data...');
      await pool.query(seedSQL);
      console.log('Data seeded successfully.');
    }

    console.log('\n✅ Database initialization complete!');
  } catch (err) {
    console.error('Error initializing database:', err.message);
    console.error(err.stack);
  } finally {
    await pool.end();
  }
}

initDatabase();
