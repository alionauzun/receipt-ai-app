// const pool = require("../config/database");
// const { createEmbedding } = require("./embeddingService");

// const SIMILARITY_THRESHOLD = 0.4;

// async function matchProduct(name) {
//   const embedding = await createEmbedding(name);
//   const embeddingString = `[${embedding.join(",")}]`;

//   const result = await pool.query(
//     `
//     SELECT id, name, (embedding <-> $1::vector) AS distance
//     FROM products
//     ORDER BY distance
//     LIMIT 1
//     `,
//     [embeddingString]
//   );

//   if (!result.rows.length) {
//     return null;
//   }

//   const bestMatch = result.rows[0];

//   if (Number(bestMatch.distance) > SIMILARITY_THRESHOLD) {
//     return null;
//   }

//   return bestMatch;
// }

// module.exports = { matchProduct };

const pool = require("../config/database");

function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

async function matchProduct(name) {
  const normalized = normalize(name);

  const result = await pool.query(
    `
    SELECT id, name, normalized_name
    FROM products
    WHERE normalized_name = $1
    LIMIT 1
    `,
    [normalized]
  );

  if (!result.rows.length) {
    return null;
  }

  return result.rows[0];
}

module.exports = { matchProduct };