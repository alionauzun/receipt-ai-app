const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  getUserNotifications,
  markNotificationAsRead,
} = require("../services/notificationService");
const { runAlertsForUser } = require("../services/alertEngineService");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = await getUserNotifications(userId);
    return res.json(notifications);
  } catch (err) {
    console.error("GET NOTIFICATIONS ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

router.post("/run", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { storeIds } = req.body || {};

    const created = await runAlertsForUser(userId, storeIds || []);

    return res.json({
      message: "Alerts evaluated",
      created,
    });
  } catch (err) {
    console.error("RUN ALERTS ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

router.patch("/:notificationId/read", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const notificationId = Number(req.params.notificationId);

    const notification = await markNotificationAsRead(notificationId, userId);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    return res.json(notification);
  } catch (err) {
    console.error("READ NOTIFICATION ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;