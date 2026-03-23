// ce fichier contient la logique pour calculer les dépenses mensuelles d'un utilisateur à partir de la base de données. Il exporte une fonction getMonthlySpending qui prend l'ID de l'utilisateur en entrée et retourne une liste des mois avec les dépenses totales correspondantes. La fonction utilise une requête SQL pour agréger les dépenses par mois en fonction des achats effectués par l'utilisateur.
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