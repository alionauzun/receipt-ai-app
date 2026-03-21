const { Pool } = require ("pg");

const pool = new Pool({
    user: "aliona",
    host: "localhost",
    database: "receipt_ai",
    password: "Developpeuse11",
    port: 5432,
    options: "-c search_path=public"
  });

module.exports = pool;