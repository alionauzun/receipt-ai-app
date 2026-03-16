function parseReceipt(text) {

    const lines = text.split("\n");
  
    const products = [];
  
    for (let line of lines) {
  
      line = line.trim();
  
      if (!line) continue;
  
      // ignorer certaines lignes
      if (
        line.toLowerCase().includes("réduction") ||
        line.toLowerCase().includes("total") ||
        line.toLowerCase().includes("tva") ||
        line.toLowerCase().includes("carte")
      ) {
        continue;
      }
  
      // regex produit
      const match = line.match(/(.+?)\s+(\d+,\d+)\s+(\d+)\s+(\d+,\d+)/);
  
      if (match) {
  
        const name = match[1].trim();
  
        const price = parseFloat(match[2].replace(",", "."));
  
        const qty = parseInt(match[3]);
  
        products.push({
          name,
          price,
          qty
        });
  
      }
  
    }
  
    return products;
  }
  
  module.exports = { parseReceipt };