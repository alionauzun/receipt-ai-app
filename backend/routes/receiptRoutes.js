const express = require("express");
const router = express.Router();
const multer = require("multer");
const receiptController = require("../controllers/receiptController");
const receiptRoutes = require("../routes/receiptRoutes");

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("receipt"), receiptController.uploadReceipt);

module.exports = router;