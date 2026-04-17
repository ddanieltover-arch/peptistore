import { pool } from '../src/db.js';

async function testConnection() {
  console.log('Testing Database Connection...');
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connection Successful! Time on DB:', res.rows[0].now);
  } catch (err) {
    console.error('Connection Failed:', err);
  } finally {
    process.exit(0);
  }
}

testConnection();
