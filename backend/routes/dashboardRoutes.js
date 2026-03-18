const express = require("express");
const router = express.Router();
const { getDashboard } = require("../services/dashboardService");

router.get("/", async (req, res) => {

  const data = await getDashboard(1);

  res.json(data);
});

module.exports = router;