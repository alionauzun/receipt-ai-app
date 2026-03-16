const { readReceipt } = require("../services/ocrService");
const { parseReceipt } = require("../services/receiptParser");

exports.uploadReceipt = async (req, res) => {

  try {

    const imagePath = req.file.path;

    const text = await readReceipt(imagePath);

    const products = parseReceipt(text);

    res.json({
      message: "Receipt scanned",
      products
    });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};