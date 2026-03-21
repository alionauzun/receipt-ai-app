const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const { getDashboard } = require("../services/dashboardService");
const { getCategoryInsights } = require("../services/insightService");
const { getTopProducts } = require("../services/recommendationService");
const { generateAIInsights } = require("../services/aiService");

router.get("/insights", async (req, res) => {
    
    try {
    const userId = req.user.userId;

    const dashboard = await getDashboard(userId);
    const categories = await getCategoryInsights(userId);
    const topProducts = await getTopProducts(userId);

    const aiResponse = await generateAIInsights({
      dashboard,
      categories,
      topProducts
    });

    res.json({
      ai: aiResponse
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

module.exports = router;