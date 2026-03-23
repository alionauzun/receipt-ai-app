// Ce fichier est responsable de générer des alertes personnalisées pour les utilisateurs en fonction de leurs habitudes de consommation et des opportunités d’économies identifiées.


    const pool = require("../config/database");
    const { getHabitualBasketFromPurchases } = require("./basketService");
    const { compareBasketAcrossStores } = require("./priceComparisonService");
    const { createNotification } = require("./notificationService");
    

    // Regle 1 -- budget mensuel. Si :
        // - dépenses du mois > 80 % du budget.
    // Alors :
        // Créer notification "Attention, vous avez déja utilisé 82% de votre budget mensuel."
    async function checkBudgetAlert(userId) {
      const prefResult = await pool.query(
        `
        SELECT budget_monthly
        FROM user_preferences
        WHERE user_id = $1
        `,
        [userId]
      );
    
      if (!prefResult.rows.length || !prefResult.rows[0].budget_monthly) {
        return null;
      }
    
      const budget = Number(prefResult.rows[0].budget_monthly);
    
      const spendingResult = await pool.query(
        `
        SELECT COALESCE(SUM(price * quantity), 0) AS total
        FROM purchases
        WHERE user_id = $1
          AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
        `,
        [userId]
      );
    
      const spent = Number(spendingResult.rows[0].total || 0);
      const ratio = budget > 0 ? spent / budget : 0;
    
      if (ratio >= 0.8) {
        return createNotification(
          userId,
          "budget",
          "Budget presque atteint",
          `Vous avez déjà utilisé ${Math.round(ratio * 100)}% de votre budget mensuel.`,
          { budget, spent, ratio }
        );
      }
    
      return null;
    }


    // Regle 2 -- catégorie en hausse. Si :
        // - dépenses catégorie >+20% vs mois précédent
    // Alors :
        // Créer notification "Vos dépenses en alimentation ont augmenté de 25% ce mois ci."
    
    async function checkCategorySpikeAlert(userId) {
      const result = await pool.query(
        `
        WITH current_month AS (
          SELECT COALESCE(p.category, 'autre') AS category,
                 SUM(pu.price * pu.quantity) AS total
          FROM purchases pu
          JOIN products p ON pu.product_id = p.id
          WHERE pu.user_id = $1
            AND DATE_TRUNC('month', pu.created_at) = DATE_TRUNC('month', CURRENT_DATE)
          GROUP BY p.category
        ),
        previous_month AS (
          SELECT COALESCE(p.category, 'autre') AS category,
                 SUM(pu.price * pu.quantity) AS total
          FROM purchases pu
          JOIN products p ON pu.product_id = p.id
          WHERE pu.user_id = $1
            AND DATE_TRUNC('month', pu.created_at) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
          GROUP BY p.category
        )
        SELECT
          c.category,
          c.total AS current_total,
          COALESCE(p.total, 0) AS previous_total
        FROM current_month c
        LEFT JOIN previous_month p ON c.category = p.category
        ORDER BY c.total DESC
        `
        ,
        [userId]
      );
    
      for (const row of result.rows) {
        const current = Number(row.current_total || 0);
        const previous = Number(row.previous_total || 0);
    
        if (previous > 0) {
          const increase = (current - previous) / previous;
    
          if (increase >= 0.2) {
            return createNotification(
              userId,
              "category_spike",
              "Hausse détectée dans une catégorie",
              `Vos dépenses en ${row.category} ont augmenté de ${Math.round(increase * 100)}% par rapport au mois dernier.`,
              {
                category: row.category,
                current,
                previous,
                increase,
              }
            );
          }
        }
      }
    
      return null;
    }
    

    // Regle 3 -- panier moins chier ailleurs. Si :
        // - le panier reconstitué existe
        // - comparaison faite
        // - économie > 5€
    // Alors : 
    // Créer notification "Votre panier habituel coute 8€ de moins chez Leclerc cette semaine." 
    async function checkCheaperBasketAlert(userId, storeIds) {
      if (!Array.isArray(storeIds) || storeIds.length < 2) {
        return null;
      }
    
      const basket = await getHabitualBasketFromPurchases(userId, 30, "Panier habituel auto");
    
      if (!basket || !basket.items || basket.items.length === 0) {
        return null;
      }
    
      const comparison = await compareBasketAcrossStores(userId, basket.id, storeIds);
    
      if (!comparison.bestStore || !comparison.stores || comparison.stores.length < 2) {
        return null;
      }
    
      const savings = Number(comparison.bestStore.savingsVsWorst || 0);
    
      if (savings >= 5) {
        return createNotification(
          userId,
          "basket_savings",
          "Panier moins cher ailleurs",
          `Votre panier habituel est moins cher chez ${comparison.bestStore.storeName}. Économie estimée : ${savings}€.`,
          comparison
        );
      }
    
      return null;
    }
    
    async function runAlertsForUser(userId, storeIds = []) {
      const created = [];
    
      const budgetAlert = await checkBudgetAlert(userId);
      if (budgetAlert) created.push(budgetAlert);
    
      const categoryAlert = await checkCategorySpikeAlert(userId);
      if (categoryAlert) created.push(categoryAlert);
    
      const basketAlert = await checkCheaperBasketAlert(userId, storeIds);
      if (basketAlert) created.push(basketAlert);
    
      return created;
    }
    
    module.exports = {
      checkBudgetAlert,
      checkCategorySpikeAlert,
      checkCheaperBasketAlert,
      runAlertsForUser,
    };