const { createProduct } = require("./productService");

async function learnNewProduct(name) {
  return await createProduct(name);
}

module.exports = { learnNewProduct };