import db from "../config/db.js";

export const createStore = async (req, res) => {
  const { store_name, store_owner, store_email, store_address } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO store (store_name, store_owner, store_email, store_address) VALUES ($1, $2, $3, $4) RETURNING *",
      [store_name, store_owner, store_email, store_address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database insert error" });
  }
};

export const getStores = async (req, res) => {
  try {
    const { user_id } = req.query;
    const stores = await db.query("SELECT * FROM store ORDER BY id ASC");
    const storeRows = stores.rows;

    const out = await Promise.all(
      storeRows.map(async (s) => {
        const avgRes = await db.query(
          "SELECT AVG(rating)::numeric(10,2) AS avg_rating, COUNT(*) AS rating_count FROM ratings WHERE store_id = $1",
          [s.id]
        );
        const avg_rating = avgRes.rows[0].avg_rating ? parseFloat(avgRes.rows[0].avg_rating) : null;
        let user_rating = null;
        if (user_id) {
          const ur = await db.query(
            "SELECT rating FROM ratings WHERE store_id = $1 AND user_id = $2",
            [s.id, user_id]
          );
          if (ur.rows[0]) user_rating = ur.rows[0].rating;
        }
        return { ...s, avg_rating, rating_count: parseInt(avgRes.rows[0].rating_count, 10), user_rating };
      })
    );

    res.json(out);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).send("Server error");
  }
};
