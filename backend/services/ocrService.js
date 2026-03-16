const Tesseract = require("tesseract.js");

async function readReceipt(imagePath) {

  const result = await Tesseract.recognize(
    imagePath,
    "eng"
  );

  return result.data.text;
}

module.exports = { readReceipt };