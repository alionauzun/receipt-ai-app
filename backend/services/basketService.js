// Ce fichier est responsable de :
// - créer panier 
// - lire panier
// - construire panier habituel à partir de l'historique d'achat 

const pool = require("../config/database");

async function createBasket(userId, name, basketType = "manual", periodType = null) {
  const result = await pool.query(
    `
    INSERT INTO user_baskets (user_id, name, basket_type, period_type)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [userId, name, basketType, periodType]
  );

  return result.rows[0];
}

async function addItemsToBasket(basketId, items) {
  for (const item of items) {
    await pool.query(
      `
      INSERT INTO user_basket_items (
        basket_id,
        product_id,
        expected_quantity,
        unit_type,
        frequency_score
      )
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        basketId,
        item.productId,
        item.expectedQuantity || 1,
        item.unitType || null,
        item.frequencyScore || null,
      ]
    );
  }
}

async function getBasketById(basketId, userId) {
  const basketResult = await pool.query(
    `
    SELECT *
    FROM user_baskets
    WHERE id = $1 AND user_id = $2
    `,
    [basketId, userId]
  );

  if (!basketResult.rows.length) {
    return null;
  }

  const itemsResult = await pool.query(
    `
    SELECT
      ubi.id,
      ubi.product_id,
      ubi.expected_quantity,
      ubi.unit_type,
      ubi.frequency_score,
      p.name,
      p.category,
      p.subcategory
    FROM user_basket_items ubi
    JOIN products p ON ubi.product_id = p.id
    WHERE ubi.basket_id = $1
    ORDER BY ubi.id ASC
    `,
    [basketId]
  );

  return {
    ...basketResult.rows[0],
    items: itemsResult.rows,
  };
}

//Fonctions clé : getHabitualBasket(userId, period = 30)

// -prendre les achats des 30 derniers jours
// - calculer la fréquence / quantité moyenne
// - produire un panier type

async function getHabitualBasketFromPurchases(userId, days = 30, name = null) {
  const result = await pool.query(
    `
    SELECT
      p.id AS product_id,
      p.name,
      p.category,
      p.subcategory,
      COUNT(*) AS purchase_count,
      AVG(pu.quantity) AS avg_quantity
    FROM purchases pu
    JOIN products p ON pu.product_id = p.id
    WHERE pu.user_id = $1
      AND pu.created_at >= NOW() - ($2 || ' days')::interval
    GROUP BY p.id, p.name, p.category, p.subcategory
    HAVING COUNT(*) >= 1
    ORDER BY purchase_count DESC, p.name ASC
    LIMIT 20
    `,
    [userId, String(days)]
  );

  const basketName = name || `Panier habituel ${days} jours`;

  const basket = await createBasket(userId, basketName, "habitual", `${days}_days`);

  const items = result.rows.map((row) => ({
    productId: row.product_id,
    expectedQuantity: Number(row.avg_quantity || 1),
    unitType: null,
    frequencyScore: Number(row.purchase_count || 0),
  }));

  await addItemsToBasket(basket.id, items);

  return getBasketById(basket.id, userId);
}

module.exports = {
  createBasket,
  addItemsToBasket,
  getBasketById,
  getHabitualBasketFromPurchases,
};