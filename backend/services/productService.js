const pool = require("../config/database");
const { createEmbedding } = require("./embeddingService");

async function createProduct(name) {

  const embedding = await createEmbedding(name);

  const result = await pool.query(
    `INSERT INTO products (name, embedding)
     VALUES ($1,$2)
     RETURNING *`,
    [name, embedding]
  );

  return result.rows[0];
}

module.exports = { createProduct };