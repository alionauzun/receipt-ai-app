// Ce ficier contient les fonctions de service pour l'analyse des données Il calcule :

// top catégories
// top produits
// dépenses mensuelles
// fréquence d’achat

const pool = require("../config/database");

async function getUserAnalysis(userId) {
  // 1. Dépenses totales
  const totalResult = await pool.query(
    `
    SELECT COALESCE(SUM(price * quantity), 0) AS total
    FROM purchases
    WHERE user_id = $1
    `,
    [userId]
  );

  // 2. Dépenses mensuelles
  const monthlyResult = await pool.query(
    `
    SELECT 
      DATE_TRUNC('month', created_at) AS month,
      SUM(price * quantity) AS total
    FROM purchases
    WHERE user_id = $1
    GROUP BY month
    ORDER BY month DESC
    `,
    [userId]
  );

  // 3. Dépenses par catégorie
  const categoryResult = await pool.query(
    `
    SELECT 
      COALESCE(p.category, 'autre') AS category,
      SUM(pu.price * pu.quantity) AS total
    FROM purchases pu
    JOIN products p ON pu.product_id = p.id
    WHERE pu.user_id = $1
    GROUP BY p.category
    ORDER BY total DESC
    `,
    [userId]
  );

  // 4. Top produits
  const topProductsResult = await pool.query(
    `
    SELECT 
      p.name,
      COALESCE(p.category, 'autre') AS category,
      COUNT(*) AS frequency,
      SUM(pu.quantity) AS total_quantity,
      SUM(pu.price * pu.quantity) AS total_spent
    FROM purchases pu
    JOIN products p ON pu.product_id = p.id
    WHERE pu.user_id = $1
    GROUP BY p.name, p.category
    ORDER BY total_spent DESC
    LIMIT 10
    `,
    [userId]
  );

  // 5. Fréquence d'achat par catégorie
  const frequencyByCategoryResult = await pool.query(
    `
    SELECT 
      COALESCE(p.category, 'autre') AS category,
      COUNT(*) AS purchase_count
    FROM purchases pu
    JOIN products p ON pu.product_id = p.id
    WHERE pu.user_id = $1
    GROUP BY p.category
    ORDER BY purchase_count DESC
    `,
    [userId]
  );

  return {
    totalSpent: Number(totalResult.rows[0].total || 0),
    monthlySpending: monthlyResult.rows.map((row) => ({
      month: row.month,
      total: Number(row.total),
    })),
    categories: categoryResult.rows.map((row) => ({
      category: row.category,
      total: Number(row.total),
    })),
    topProducts: topProductsResult.rows.map((row) => ({
      name: row.name,
      category: row.category,
      frequency: Number(row.frequency),
      totalQuantity: Number(row.total_quantity),
      totalSpent: Number(row.total_spent),
    })),
    frequencyByCategory: frequencyByCategoryResult.rows.map((row) => ({
      category: row.category,
      purchaseCount: Number(row.purchase_count),
    })),
  };
}

module.exports = { getUserAnalysis };