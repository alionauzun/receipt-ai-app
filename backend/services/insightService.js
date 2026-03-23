const pool = require("../config/database");

async function getCategoryInsights(userId) {
  const result = await pool.query(
    `
    SELECT 
      p.category,
      SUM(pu.price * pu.quantity) as total
    FROM purchases pu
    JOIN products p ON pu.product_id = p.id
    WHERE pu.user_id = $1
    GROUP BY p.category
    ORDER BY total DESC
    `,
    [userId]
  );

  return result.rows;
}

function generateInsights(categories) {
  if (!categories.length) return [];

  const insights = [];

  const top = categories[0];

  insights.push(
    `Tu dépenses le plus en ${top.category} (${Math.round(Number(top.total))}€)`
  );

  categories.forEach((cat) => {
    const total = Number(cat.total);

    if (cat.category === "snacks" && total > 50) {
      insights.push("Tu dépenses beaucoup en snacks 🍪");
    }

    if (cat.category === "boissons" && total > 40) {
      insights.push("Tu dépenses beaucoup en boissons 🥤");
    }
  });

  return insights;
}

async function getInsights(userId) {
  const categories = await getCategoryInsights(userId);
  const insights = generateInsights(categories);

  return {
    categories,
    insights,
  };
}

module.exports = { getCategoryInsights, generateInsights, getInsights };