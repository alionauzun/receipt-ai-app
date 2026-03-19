const express = require("express");
const router = express.Router();
const multer = require("multer");
const receiptController = require("../controllers/receiptController");
const authMiddleware = require("../middleware/authMiddleware");

const upload = multer({ dest: "uploads/" });

// 🔥 upload sécurisé
router.post(
  "/upload",
  authMiddleware,
  upload.single("receipt"),
  receiptController.uploadReceipt
);

module.exports = router;