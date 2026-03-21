const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getDashboard } = require("../services/dashboardService");

// ROUTE DASHBOARD SÉCURISÉE
router.get("/", authMiddleware, async (req, res) => {

  try {

    // récupérer user depuis le token
    const userId = req.user.userId;

    // appeler le service avec le vrai user
    const data = await getDashboard(userId);
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

module.exports = router;