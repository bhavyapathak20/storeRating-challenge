// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";


const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "online-store",
  password: "Passw0rd",
  port: 5432,
});

await db.connect();

// Ensure ratings table exists
await db.query(`
CREATE TABLE IF NOT EXISTS ratings (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES store(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (store_id, user_id)
);
`).catch((e) => {
  console.error("Could not create ratings table:", e);
});

// --- Existing insertion endpoints (unchanged logic) ---
app.post("/api/users", async (req, res) => {
  const { name, email, address, password, isStoreOwner, store_name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into users table
    const userResult = await db.query(
      "INSERT INTO users (name, email, address, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, address, hashedPassword]
    );

    // If they chose to register as store owner
    if (isStoreOwner) {
      await db.query(
        "INSERT INTO store (store_name, store_owner, store_email, store_address) VALUES ($1, $2, $3, $4)",
        [store_name || `${name}'s Store`, name, email, address]
      );
    }

    res.status(201).json({ message: "User created successfully", user: userResult.rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "Email already exists" });
    }
    console.error("Database insert error:", err);
    res.status(500).json({ message: "Database insert error" });
  }
});


app.post("/api/store", async (req, res) => {
  const { store_name, store_owner, store_email, store_address } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO store (store_name, store_owner, store_email, store_address) VALUES ($1, $2, $3, $4) RETURNING *",
      [store_name, store_owner, store_email, store_address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Database insert error" });
  }
});

app.post("/api/admin", async (req, res) => {
  const { admin_name, admin_email, admin_address, admin_password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(admin_password, 10);
    const result = await db.query(
      "INSERT INTO admin (admin_name, admin_email, admin_address, admin_password) VALUES ($1, $2, $3, $4) RETURNING *",
      [admin_name, admin_email, admin_address, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Database insert error:", err);
    res.status(500).json({ message: "Database insert error" });
  }
});


// --- List endpoints ---
app.get("/api/users", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/stores", async (req, res) => {
  try {
    // If user_id provided, return user's submitted rating per store as well
    const { user_id } = req.query;

    const stores = await db.query("SELECT * FROM store ORDER BY id ASC");
    const storeRows = stores.rows;

    // For each store, compute average and optionally the user's rating
    const out = await Promise.all(
      storeRows.map(async (s) => {
        const avgRes = await db.query(
          "SELECT AVG(rating)::numeric(10,2) AS avg_rating, COUNT(*) AS rating_count FROM ratings WHERE store_id = $1",
          [s.id]
        );
        const avg_rating = avgRes.rows[0].avg_rating
          ? parseFloat(avgRes.rows[0].avg_rating)
          : null;
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
});

app.get("/api/users/count", async (req, res) => {
  try {
    const result = await db.query("SELECT COUNT(*) FROM users");
    res.json({ total: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// --- LOGIN endpoint: checks admin, users, store in that order ---


// --- Ratings endpoints ---

// Submit or update rating
app.post("/api/ratings", async (req, res) => {
  const { store_id, user_id, rating } = req.body;
  if (!store_id || !user_id || !rating) {
    return res.status(400).json({ message: "store_id, user_id and rating required" });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "rating should be between 1 and 5" });
  }

  try {
    // Upsert: if exists update, else insert
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
});

// Get ratings for a store (list + avg)
app.get("/api/ratings/store/:storeId", async (req, res) => {
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
    const avgRes = await db.query("SELECT AVG(rating)::numeric(10,2) AS avg_rating, COUNT(*) AS rating_count FROM ratings WHERE store_id = $1", [storeId]);

    res.json({ ratings: rows.rows, avg_rating: avgRes.rows[0].avg_rating ? parseFloat(avgRes.rows[0].avg_rating) : null, rating_count: parseInt(avgRes.rows[0].rating_count,10) });
  } catch (err) {
    console.error("Error fetching store ratings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get ratings by user
app.get("/api/ratings/user/:userId", async (req, res) => {
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
});

// Get aggregated stats for admin dashboard
app.get("/api/stats", async (req, res) => {
  try {
    const usersRes = await db.query("SELECT COUNT(*) AS total_users FROM users");
    const storesRes = await db.query("SELECT COUNT(*) AS total_stores FROM store");
    const ratingsRes = await db.query("SELECT COUNT(*) AS total_ratings FROM ratings");
    res.json({
      total_users: parseInt(usersRes.rows[0].total_users, 10),
      total_stores: parseInt(storesRes.rows[0].total_stores, 10),
      total_ratings: parseInt(ratingsRes.rows[0].total_ratings, 10),
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
