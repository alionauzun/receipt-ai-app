const { Pool } = require ("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "receipt_ai",
    password: "Developpeuse11",
    port: 5432,
})

module.exports = pool;