// Ce fichier est responsable de comparer les prix d’un panier type entre différents magasins. 

const pool = require("../config/database");
const { getBasketById } = require("./basketService");

async function getLatestStorePrice(productId, storeId) {
  const result = await pool.query(
    `
    SELECT
      sp.id,
      sp.product_id,
      sp.store_id,
      sp.price,
      sp.currency,
      sp.promo_label,
      sp.availability,
      sp.valid_from,
      sp.valid_to,
      sp.observed_at
    FROM store_prices sp
    WHERE sp.product_id = $1
      AND sp.store_id = $2
      AND sp.availability = TRUE
    ORDER BY sp.observed_at DESC
    LIMIT 1
    `,
    [productId, storeId]
  );

  return result.rows[0] || null;
}

async function getStoreById(storeId) {
  const result = await pool.query(
    `
    SELECT *
    FROM stores
    WHERE id = $1
    `,
    [storeId]
  );

  return result.rows[0] || null;
}

async function compareBasketAcrossStores(userId, basketId, storeIds) {
  const basket = await getBasketById(basketId, userId);

  if (!basket) {
    throw new Error("Basket not found");
  }

  const comparisonResults = [];

  for (const storeId of storeIds) {
    const store = await getStoreById(storeId);

    if (!store) continue;

    let total = 0;
    let missingProducts = 0;
    const items = [];

    for (const item of basket.items) {
      const priceRow = await getLatestStorePrice(item.product_id, storeId);

      if (!priceRow) {
        missingProducts += 1;

        items.push({
          productId: item.product_id,
          name: item.name,
          quantity: Number(item.expected_quantity),
          found: false,
          unitPrice: null,
          totalPrice: null,
        });

        continue;
      }

      const quantity = Number(item.expected_quantity || 1);
      const unitPrice = Number(priceRow.price);
      const totalPrice = Number((quantity * unitPrice).toFixed(2));

      total += totalPrice;

      items.push({
        productId: item.product_id,
        name: item.name,
        quantity,
        found: true,
        unitPrice,
        totalPrice,
        promoLabel: priceRow.promo_label,
      });
    }

    comparisonResults.push({
      storeId: store.id,
      storeName: store.name,
      total: Number(total.toFixed(2)),
      missingProducts,
      items,
    });
  }

  comparisonResults.sort((a, b) => a.total - b.total);

  const bestStore = comparisonResults[0] || null;
  const worstStore = comparisonResults[comparisonResults.length - 1] || null;

  return {
    basket: {
      id: basket.id,
      name: basket.name,
      basketType: basket.basket_type,
      itemCount: basket.items.length,
    },
    stores: comparisonResults,
    bestStore: bestStore
      ? {
          ...bestStore,
          savingsVsWorst:
            worstStore && worstStore.total > bestStore.total
              ? Number((worstStore.total - bestStore.total).toFixed(2))
              : 0,
        }
      : null,
  };
}

async function compareVirtualBasket(items, storeIds) {
  const comparisonResults = [];

  for (const storeId of storeIds) {
    const store = await getStoreById(storeId);

    if (!store) continue;

    let total = 0;
    let missingProducts = 0;
    const detailedItems = [];

    for (const item of items) {
      const priceRow = await getLatestStorePrice(item.productId, storeId);

      if (!priceRow) {
        missingProducts += 1;

        detailedItems.push({
          productId: item.productId,
          quantity: Number(item.quantity || 1),
          found: false,
          unitPrice: null,
          totalPrice: null,
        });

        continue;
      }

      const quantity = Number(item.quantity || 1);
      const unitPrice = Number(priceRow.price);
      const totalPrice = Number((quantity * unitPrice).toFixed(2));

      total += totalPrice;

      detailedItems.push({
        productId: item.productId,
        quantity,
        found: true,
        unitPrice,
        totalPrice,
        promoLabel: priceRow.promo_label,
      });
    }

    comparisonResults.push({
      storeId: store.id,
      storeName: store.name,
      total: Number(total.toFixed(2)),
      missingProducts,
      items: detailedItems,
    });
  }

  comparisonResults.sort((a, b) => a.total - b.total);

  const bestStore = comparisonResults[0] || null;
  const worstStore = comparisonResults[comparisonResults.length - 1] || null;

  return {
    stores: comparisonResults,
    bestStore: bestStore
      ? {
          ...bestStore,
          savingsVsWorst:
            worstStore && worstStore.total > bestStore.total
              ? Number((worstStore.total - bestStore.total).toFixed(2))
              : 0,
        }
      : null,
  };
}

module.exports = {
  compareBasketAcrossStores,
  compareVirtualBasket,
};