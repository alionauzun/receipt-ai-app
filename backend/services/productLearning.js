async function learnNewProduct(name) {

    const existing = await pool.query(
     "SELECT id FROM products WHERE name ILIKE $1",
     [name]
    );
   
    if(existing.rows.length === 0){
   
      await pool.query(
       "INSERT INTO detected_products(name) VALUES($1)",
       [name]
      );
   
    }
   
   }