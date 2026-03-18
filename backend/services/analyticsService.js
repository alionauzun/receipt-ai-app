const pool = require("../config/database");

async function getMonthlySpending(userId) {

  const result = await pool.query(
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

  return result.rows;
}

module.exports = { getMonthlySpending };