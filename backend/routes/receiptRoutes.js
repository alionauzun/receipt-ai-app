const express = require("express");
const router = express.Router();
const multer = require("multer");
const receiptController = require("../controllers/receiptController");

const upload = multer({ dest: "uploads/" });
console.log("🔥 uploadReceipt appelé");
router.post("/upload", upload.single("receipt"), receiptController.uploadReceipt);

module.exports = router;