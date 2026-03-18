const pool = require("../config/database");

async function getDashboard(userId) {

  // 💰 Total dépenses
  const total = await pool.query(
    `
    SELECT SUM(price * quantity) AS total
    FROM purchases
    WHERE user_id = $1
    `,
    [userId]
  );

  // 📊 Dépenses par mois
  const monthly = await pool.query(
    `
    SELECT DATE_TRUNC('month', created_at) AS month,
           SUM(price * quantity) AS total
    FROM purchases
    WHERE user_id = $1
    GROUP BY month
    ORDER BY month DESC
    `,
    [userId]
  );

  // 🛒 Top produits
  const topProducts = await pool.query(
    `
    SELECT p.name, COUNT(*) as count
    FROM purchases pu
    JOIN products p ON pu.product_id = p.id
    WHERE pu.user_id = $1
    GROUP BY p.name
    ORDER BY count DESC
    LIMIT 5
    `,
    [userId]
  );

  return {
    total: total.rows[0].total || 0,
    monthly: monthly.rows,
    topProducts: topProducts.rows
  };
}

module.exports = { getDashboard };