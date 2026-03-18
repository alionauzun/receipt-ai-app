const pool = require("../config/database");
const { createEmbedding } = require("./embeddingService");

async function matchProduct(name) {

  // ✅ DEBUG DB
  const dbCheck = await pool.query("SELECT current_database()");
  console.log("DB:", dbCheck.rows);

  const tableCheck = await pool.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'products'
  `);
  console.log("COLUMNS:", tableCheck.rows);

  // 👉 STOP ICI POUR TEST
  return null;
}

module.exports = { matchProduct };