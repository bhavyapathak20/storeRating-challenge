import db from "../config/db.js";

export const createOrUpdateRating = async (req, res) => {
  const { store_id, user_id, rating } = req.body;
  if (!store_id || !user_id || !rating) {
    return res.status(400).json({ message: "store_id, user_id and rating required" });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "rating should be between 1 and 5" });
  }

  try {
    const upsert = await db.query(
      `INSERT INTO ratings (store_id, user_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (store_id, user_id) DO UPDATE
       SET rating = EXCLUDED.rating, updated_at = NOW()
       RETURNING *;`,
      [store_id, user_id, rating]
    );
    res.json(upsert.rows[0]);
  } catch (err) {
    console.error("Rating insert/update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStoreRatings = async (req, res) => {
  const { storeId } = req.params;
  try {
    const rows = await db.query(
      `SELECT r.id, r.rating, r.user_id, u.name AS user_name, u.email AS user_email, r.created_at
       FROM ratings r
       LEFT JOIN users u ON u.id = r.user_id
       WHERE r.store_id = $1
       ORDER BY r.created_at DESC`,
      [storeId]
    );
    const avgRes = await db.query(
      "SELECT AVG(rating)::numeric(10,2) AS avg_rating, COUNT(*) AS rating_count FROM ratings WHERE store_id = $1",
      [storeId]
    );

    res.json({
      ratings: rows.rows,
      avg_rating: avgRes.rows[0].avg_rating ? parseFloat(avgRes.rows[0].avg_rating) : null,
      rating_count: parseInt(avgRes.rows[0].rating_count, 10)
    });
  } catch (err) {
    console.error("Error fetching store ratings:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserRatings = async (req, res) => {
  const { userId } = req.params;
  try {
    const rows = await db.query(
      `SELECT r.id, r.rating, r.store_id, s.store_name, s.store_email, r.created_at
       FROM ratings r
       LEFT JOIN store s ON s.id = r.store_id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );
    res.json(rows.rows);
  } catch (err) {
    console.error("Error fetching user ratings:", err);
    res.status(500).json({ message: "Server error" });
  }
};
