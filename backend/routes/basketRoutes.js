const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createBasket,
  addItemsToBasket,
  getBasketById,
  getHabitualBasketFromPurchases,
} = require("../services/basketService");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, basketType, periodType, items } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Basket name is required" });
    }

    const basket = await createBasket(
      userId,
      name,
      basketType || "manual",
      periodType || null
    );

    if (Array.isArray(items) && items.length > 0) {
      await addItemsToBasket(basket.id, items);
    }

    const fullBasket = await getBasketById(basket.id, userId);

    return res.json(fullBasket);
  } catch (err) {
    console.error("CREATE BASKET ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

router.post("/habitual", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { days, name } = req.body;

    const basket = await getHabitualBasketFromPurchases(
      userId,
      Number(days || 30),
      name || null
    );

    return res.json(basket);
  } catch (err) {
    console.error("HABITUAL BASKET ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

router.get("/:basketId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const basketId = Number(req.params.basketId);

    const basket = await getBasketById(basketId, userId);

    if (!basket) {
      return res.status(404).json({ error: "Basket not found" });
    }

    return res.json(basket);
  } catch (err) {
    console.error("GET BASKET ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;