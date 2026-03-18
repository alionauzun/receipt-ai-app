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
      `Tu dépenses le plus en ${top.category} (${Math.round(top.total)}€)`
    );
  
    // Exemple logique simple
    categories.forEach(cat => {
  
      if (cat.category === "snacks" && cat.total > 50) {
        insights.push("Tu dépenses beaucoup en snacks 🍪");
      }
  
      if (cat.category === "boissons" && cat.total > 40) {
        insights.push("Tu dépenses beaucoup en boissons 🥤");
      }
  
    });
  
    return insights;
  }
  
  module.exports = { getCategoryInsights, generateInsights };