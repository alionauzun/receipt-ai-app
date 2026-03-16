const Fuse = require("fuse.js");

function matchProducts(lines, products) {

  const fuse = new Fuse(products, {
    keys: ["name"],
    threshold: 0.4
  });

  const results = [];

  for (const line of lines) {

    const match = fuse.search(line);

    if (match.length > 0) {

      results.push({
        original: line,
        matched: match[0].item.name
      });

    } else {

      results.push({
        original: line,
        matched: null
      });

    }

  }

  return results;
}

module.exports = { matchProducts };