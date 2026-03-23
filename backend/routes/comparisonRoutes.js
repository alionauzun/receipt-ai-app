const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  compareBasketAcrossStores,
  compareVirtualBasket,
} = require("../services/priceComparisonService");

router.post("/basket", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { basketId, storeIds } = req.body;

    if (!basketId || !Array.isArray(storeIds) || storeIds.length === 0) {
      return res.status(400).json({
        error: "basketId and storeIds are required",
      });
    }

    const result = await compareBasketAcrossStores(
      userId,
      Number(basketId),
      storeIds.map(Number)
    );

    return res.json(result);
  } catch (err) {
    console.error("COMPARE BASKET ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

router.post("/simulate", authMiddleware, async (req, res) => {
  try {
    const { items, storeIds } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items are required" });
    }

    if (!Array.isArray(storeIds) || storeIds.length === 0) {
      return res.status(400).json({ error: "storeIds are required" });
    }

    const result = await compareVirtualBasket(
      items,
      storeIds.map(Number)
    );

    return res.json(result);
  } catch (err) {
    console.error("SIMULATE COMPARISON ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;