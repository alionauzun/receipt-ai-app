const pool = require("../config/database");

async function getMonthlyTrend(userId) {
  const result = await pool.query(
    `
    SELECT 
      DATE_TRUNC('month', created_at) AS month,
      SUM(price * quantity) AS total
    FROM purchases
    WHERE user_id = $1
    GROUP BY month
    ORDER BY month DESC
    LIMIT 6
    `,
    [userId]
  );

  return result.rows.map((row) => ({
    month: row.month,
    total: Number(row.total),
  }));
}

async function predictMonthEndSpending(userId) {
  const result = await pool.query(
    `
    SELECT 
      EXTRACT(DAY FROM created_at) AS day,
      SUM(price * quantity) AS total
    FROM purchases
    WHERE user_id = $1
      AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY day
    ORDER BY day
    `,
    [userId]
  );

  const rows = result.rows.map((r) => ({
    day: Number(r.day),
    total: Number(r.total),
  }));

  if (rows.length === 0) {
    return {
      currentMonthSpent: 0,
      predictedMonthEnd: 0,
      dailyAverage: 0,
    };
  }

  const currentSpent = rows.reduce((sum, r) => sum + r.total, 0);
  const lastDay = rows[rows.length - 1].day;
  const dailyAverage = currentSpent / lastDay;

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const predictedMonthEnd = dailyAverage * daysInMonth;

  return {
    currentMonthSpent: Number(currentSpent.toFixed(2)),
    predictedMonthEnd: Number(predictedMonthEnd.toFixed(2)),
    dailyAverage: Number(dailyAverage.toFixed(2)),
  };
}

async function predictTopRecurringProducts(userId) {
  const result = await pool.query(
    `
    SELECT 
      p.name,
      COALESCE(p.category, 'autre') AS category,
      COUNT(*) AS purchase_count,
      MAX(pu.created_at) AS last_purchase
    FROM purchases pu
    JOIN products p ON pu.product_id = p.id
    WHERE pu.user_id = $1
    GROUP BY p.name, p.category
    HAVING COUNT(*) >= 2
    ORDER BY purchase_count DESC, last_purchase DESC
    LIMIT 10
    `,
    [userId]
  );

  return result.rows.map((row) => ({
    name: row.name,
    category: row.category,
    purchaseCount: Number(row.purchase_count),
    lastPurchase: row.last_purchase,
  }));
}

async function predictCategoryPressure(userId) {
  const result = await pool.query(
    `
    SELECT 
      COALESCE(p.category, 'autre') AS category,
      SUM(pu.price * pu.quantity) AS total
    FROM purchases pu
    JOIN products p ON pu.product_id = p.id
    WHERE pu.user_id = $1
      AND pu.created_at >= NOW() - INTERVAL '60 days'
    GROUP BY p.category
    ORDER BY total DESC
    `,
    [userId]
  );

  return result.rows.map((row) => ({
    category: row.category,
    total: Number(row.total),
  }));
}

async function getPredictions(userId) {
  const monthlyTrend = await getMonthlyTrend(userId);
  const monthProjection = await predictMonthEndSpending(userId);
  const recurringProducts = await predictTopRecurringProducts(userId);
  const categoryPressure = await predictCategoryPressure(userId);

  return {
    monthlyTrend,
    monthProjection,
    recurringProducts,
    categoryPressure,
  };
}

module.exports = {
  getMonthlyTrend,
  predictMonthEndSpending,
  predictTopRecurringProducts,
  predictCategoryPressure,
  getPredictions,
};