const pool = require("../config/database");
const { readReceipt } = require("../services/ocrService");
const { parseReceipt } = require("../services/receiptParser");
const { matchProduct } = require("../services/productMatcher");
const { learnNewProduct } = require("../services/productLearning");

exports.uploadReceipt = async (req, res) => {

  try {

    console.log("🔥 uploadReceipt appelé");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imagePath = req.file.path;

    const text = await readReceipt(imagePath);

    const products = parseReceipt(text);

    const enrichedProducts = [];

    for (const product of products) {

      console.log("👉 matchProduct appelé avec :", product.name);

      let match = await matchProduct(product.name);

      if (!match) {
        console.log("🆕 Nouveau produit → apprentissage");
        match = await learnNewProduct(product.name);
      }

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