// ------ Ce fichier gere les notifications pour les utilisateurs. ----//

const pool = require("../config/database");

async function createNotification(userId, type, title, message, payload = {}) {
  const result = await pool.query(
    `
    INSERT INTO notifications (user_id, type, title, message, payload, status)
    VALUES ($1, $2, $3, $4, $5::jsonb, 'pending')
    RETURNING *
    `,
    [userId, type, title, message, JSON.stringify(payload)]
  );

  return result.rows[0];
}

async function getUserNotifications(userId) {
  const result = await pool.query(
    `
    SELECT *
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
}

async function markNotificationAsRead(notificationId, userId) {
  const result = await pool.query(
    `
    UPDATE notifications
    SET status = 'read', read_at = NOW()
    WHERE id = $1 AND user_id = $2
    RETURNING *
    `,
    [notificationId, userId]
  );

  return result.rows[0] || null;
}

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
};
