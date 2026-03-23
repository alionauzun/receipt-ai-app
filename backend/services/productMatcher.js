const pool = require("../config/database");
const { createEmbedding } = require("./embeddingService");

const SIMILARITY_THRESHOLD = 0.35;

function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

async function matchProduct(name) {
  const normalized = normalize(name);
  // 1) Match exact
  const exact = await pool.query(
    `
    SELECT id, name, normalized_name, category
    FROM products
    WHERE normalized_name = $1
    LIMIT 1
    `,
    [normalized]
  );

  if (!exact.rows.length) {
    return exact.rows[0];
  }

// 2) Fallback embedding / pgvector
const embedding = await createEmbedding(name);
const embeddingString = `[${embedding.join(",")}]`;

const result = await pool.query(
  `
  SELECT id, name, normalized_name, category, (embedding <-> $1::vector) AS distance
  FROM products
  WHERE embedding IS NOT NULL
  ORDER BY distance
  LIMIT 1
  `,
  [embeddingString]
);

if (!result.rows.length) {
  return null;
}

const bestMatch = result.rows[0];

if (Number(bestMatch.distance) > SIMILARITY_THRESHOLD) {
  return null;
}

return bestMatch;
}

module.exports = { matchProduct };