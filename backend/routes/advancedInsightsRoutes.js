const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getUserAnalysis } = require("../services/analysisService");
const { generateAdvancedInsights } = require("../services/aiInsightService");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const analysis = await getUserAnalysis(userId);
    const aiInsights = await generateAdvancedInsights(analysis);

    res.json({
      analysis,
      aiInsights,
    });
  } catch (err) {
    console.error("ADVANCED INSIGHTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;