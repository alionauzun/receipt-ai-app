const pool = require("../config/database");
const { classifyCategory } = require("./categoryService");
const {createEmbedding} = require("./embeddingService");
const { enrichProduct } = require("./productEnrichmentService");


function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

async function learnNewProduct(name) {
  const normalized = normalize(name);
  const category = await classifyCategory(name);
  
  const embedding = await createEmbedding(name);
  const embeddingString = `[${embedding.join(",")}]`;

  const result = await pool.query(
    `
    INSERT INTO products (
      name,
      normalized_name,
      category,
      subcategory,
      tags,
      unit_type,
      health_flag,
      embedding
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8::vector)
    RETURNING id, name, normalized_name, category, subcategory, tags, unit_type, health_flag
    `,
    [
      name,
      normalized,
      enriched.category,
      enriched.subcategory,
      JSON.stringify(enriched.tags),
      enriched.unit_type,
      enriched.health_flag,
      embeddingString,
    ]
  );

  return result.rows[0];
}

module.exports = { learnNewProduct };