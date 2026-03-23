// Ce script backfill les produits existants avec les données d'enrichissement (embedding, catégorie, tags, etc.)
require("dotenv").config();

const pool = require("../config/database");
const { createEmbedding } = require("../services/embeddingService");
const { enrichProduct } = require("../services/productEnrichmentService");

function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

async function backfill() {
  try {
    const result = await pool.query(`
      SELECT id, name
      FROM products
      WHERE embedding IS NULL
         OR normalized_name IS NULL
         OR category IS NULL
         OR subcategory IS NULL
         OR tags IS NULL
         OR unit_type IS NULL
         OR health_flag IS NULL
      ORDER BY id ASC
    `);

    console.log(`Produits à enrichir : ${result.rows.length}`);

    for (const product of result.rows) {
      const embedding = await createEmbedding(product.name);
      const embeddingString = `[${embedding.join(",")}]`;
      const enriched = await enrichProduct(product.name);
      const normalized = normalize(product.name);

      await pool.query(
        `
        UPDATE products
        SET normalized_name = COALESCE(normalized_name, $1),
            category = COALESCE(category, $2),
            subcategory = COALESCE(subcategory, $3),
            tags = COALESCE(tags, $4::jsonb),
            unit_type = COALESCE(unit_type, $5),
            health_flag = COALESCE(health_flag, $6),
            embedding = COALESCE(embedding, $7::vector)
        WHERE id = $8
        `,
        [
          normalized,
          enriched.category,
          enriched.subcategory,
          JSON.stringify(enriched.tags),
          enriched.unit_type,
          enriched.health_flag,
          embeddingString,
          product.id,
        ]
      );

      console.log(`✅ ${product.name} -> ${enriched.category} / ${enriched.subcategory}`);
    }

    console.log("🎉 Backfill enrichi terminé");
    process.exit(0);
  } catch (err) {
    console.error("❌ BACKFILL ENRICHMENT ERROR:", err);
    process.exit(1);
  }
}

backfill();