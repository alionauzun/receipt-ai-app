async function recommendAlternatives(userId) {

    const result = await pool.query(`
    SELECT p.name, s.quantity
    FROM user_product_stats s
    JOIN products p ON p.id = s.product_id
    WHERE user_id = $1
    ORDER BY quantity DESC
    LIMIT 5
    `,[userId]);
  
    return result.rows;
  }