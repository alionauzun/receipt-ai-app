const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getInsights } = require("../services/insightService");

// 🔥 Insights utilisateur sécurisés
router.get("/", authMiddleware, async (req, res) => {

  try {

    const userId = req.user.userId;
    const insights = await getInsights(userId);
    res.json(insights);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

module.exports = router;