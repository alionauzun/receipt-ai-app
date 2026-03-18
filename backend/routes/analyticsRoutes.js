const express = require("express");
const router = express.Router();
const { getMonthlySpending } = require("../services/analyticsService");

router.get("/monthly", async (req, res) => {

  const data = await getMonthlySpending(1);

  res.json(data);
});

router.get("/recommendations", async (req, res) => {

    const data = await getTopProducts(1);
  
    res.json(data);
  });

module.exports = router;