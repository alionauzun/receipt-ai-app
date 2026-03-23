const pool = require("../config/database");
const { readReceipt } = require("../services/ocrService");
const { parseReceipt } = require("../services/receiptParser");
const { matchProduct } = require("../services/productMatcher");
const { learnNewProduct } = require("../services/productLearning");

exports.uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.user.userId;
    const imagePath = req.file.path;

    const text = await readReceipt(imagePath);
    const products = parseReceipt(text);

    const enrichedProducts = [];

    for (const product of products) {
      let match = await matchProduct(product.name);

      if (!match) {
        match = await learnNewProduct(product.name);
      }

      if (match && (!match.category || match.category === "")) {
        const category = await classifyCategory(match.name);
      
        await pool.query(
          `
          UPDATE products
          SET category = $1
          WHERE id = $2
          `,
          [category, match.id]
        );
      
        match.category = category;
      }

      await pool.query(
        `
        INSERT INTO purchases (user_id, product_id, price, quantity)
        VALUES ($1, $2, $3, $4)
        `,
        [
          userId,
          match.id,
          product.price || 0,
          product.qty || product.quantity || 1
        ]
      );

      enrichedProducts.push({
        ...product,
        productId: match.id,
        normalizedName: match.name
      });

      console.log("✅ MATCH FINAL:", match);
    }

    res.json({
      message: "Receipt scanned",
      products: enrichedProducts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};