// const pool = require("../config/database");
// const { createEmbedding } = require("./embeddingService");

// async function learnNewProduct(name) {
//   const embedding = await createEmbedding(name);
//   const embeddingString = `[${embedding.join(",")}]`;

//   const result = await pool.query(
//     `
//     INSERT INTO products (name, embedding)
//     VALUES ($1, $2::vector)
//     RETURNING id, name
//     `,
//     [name, embeddingString]
//   );

//   return result.rows[0];
// }

// module.exports = { learnNewProduct };

const pool = require("../config/database");

function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

async function learnNewProduct(name) {
  const normalized = normalize(name);

  const result = await pool.query(
    `
    INSERT INTO products (name, normalized_name)
    VALUES ($1, $2)
    RETURNING id, name, normalized_name
    `,
    [name, normalized]
  );

  return result.rows[0];
}

module.exports = { learnNewProduct };