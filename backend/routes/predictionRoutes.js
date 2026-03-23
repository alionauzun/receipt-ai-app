const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getPredictions } = require("../services/predictionService");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const predictions = await getPredictions(userId);

    res.json(predictions);
  } catch (err) {
    console.error("PREDICTION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;