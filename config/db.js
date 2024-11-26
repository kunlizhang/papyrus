// config/db.js
const { Pool } = require('pg');

// Create PostgreSQL pool connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
