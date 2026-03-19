const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getMonthlyAnalytics } = require("../services/analyticsService");

// 🔥 analytics mensuelles sécurisées
router.get("/monthly", authMiddleware, async (req, res) => {

  try {

    // ✅ récupérer user depuis token
    const userId = req.user.userId;
    const data = await getMonthlyAnalytics(userId);
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

module.exports = router;