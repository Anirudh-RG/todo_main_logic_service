const { Pool } = require('pg');
const dotenv = require('dotenv')
dotenv.config()

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5434,
});

module.exports = pool;
