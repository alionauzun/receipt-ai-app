const express = require("express");
const router = express.Router();

const { getCategoryInsights, generateInsights } = require("../services/insightService");

router.get("/", async (req, res) => {

  const categories = await getCategoryInsights(1);

  const insights = generateInsights(categories);

  res.json({
    categories,
    insights
  });

});

module.exports = router;