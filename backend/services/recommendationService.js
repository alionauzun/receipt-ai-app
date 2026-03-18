const pool = require("../config/database");

async function getTopProducts(userId) {

  const result = await pool.query(
    `
    SELECT p.name, COUNT(*) as frequency
    FROM purchases pu
    JOIN products p ON pu.product_id = p.id
    WHERE pu.user_id = $1
    GROUP BY p.name
    ORDER BY frequency DESC
    LIMIT 5
    `,
    [userId]
  );

  return result.rows;
}

module.exports = { getTopProducts };