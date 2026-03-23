require("dotenv").config();

const pool = require("../config/database");
const { classifyCategory } = require("../services/categoryService");

async function backfillCategories() {
  try {
    const result = await pool.query(`
      SELECT id, name
      FROM products
      WHERE category IS NULL OR category = ''
      ORDER BY id ASC
    `);

    console.log(`Produits à catégoriser : ${result.rows.length}`);

    for (const product of result.rows) {
      const category = await classifyCategory(product.name);

      await pool.query(
        `
        UPDATE products
        SET category = $1
        WHERE id = $2
        `,
        [category, product.id]
      );

      console.log(`✅ ${product.name} -> ${category}`);
    }

    console.log("🎉 Backfill terminé");
    process.exit(0);
  } catch (err) {
    console.error("❌ BACKFILL ERROR:", err);
    process.exit(1);
  }
}

backfillCategories();