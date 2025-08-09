// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import bcrypt from 'bcrypt';

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
  const { name, email, address, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (name, email, address, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, address, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
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
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1) admin
    const adminRes = await db.query(
      "SELECT id, admin_name AS name, admin_email AS email, admin_address AS address, admin_password FROM admin WHERE admin_email = $1",
      [email]
    );
    if (adminRes.rows.length > 0) {
      const match = await bcrypt.compare(password, adminRes.rows[0].admin_password);
      if (match) {
        delete adminRes.rows[0].admin_password;
        return res.json({ role: "admin", user: adminRes.rows[0] });
      }
    }


    // 2) normal users (your server previously uses users(name,email,password))
    const userRes = await db.query(
        "SELECT id, name, email, address, password FROM users WHERE email = $1",
        [email]
      );
      if (userRes.rows.length > 0) {
        const match = await bcrypt.compare(password, userRes.rows[0].password);
        if (match) {
          delete userRes.rows[0].password;
          return res.json({ role: "user", user: userRes.rows[0] });
        }
      }

    // 3) store owner (store_email)
    const storeRes = await db.query(
      "SELECT id, store_name, store_owner, store_email, store_address FROM store WHERE store_email = $1",
      [email]
    );
    if (storeRes.rows.length > 0) {
      // checking password for store owners: if you keep passwords in store table you can match it here.
      // For now we assume store owners use same password stored in users/admin table - but most setups keep store auth separate.
      // We'll try to match against a 'password' column if present, else accept if email found (best-effort).
      const storeRow = storeRes.rows[0];
      // try to see if store table has password column (not in your schema)
      const checkPwd = await db.query(
        "SELECT column_name FROM information_schema.columns WHERE table_name='store' AND column_name='password'"
      );
      if (checkPwd.rows.length > 0) {
        // store has a password column, check it
        const storeAuth = await db.query(
          "SELECT id, store_name, store_owner, store_email, store_address FROM store WHERE store_email=$1 AND password=$2",
          [email, password]
        );
        if (storeAuth.rows.length > 0) {
          return res.json({ role: "store", user: storeAuth.rows[0] });
        }
      } else {
        // No password column in store table; we will require the store owner's email/password to exist in users table too.
        // Try matching email & password in users table as a fallback (i.e., store owner signed up as user)
        const storeUserMatch = await db.query(
          "SELECT id, name, email, address FROM users WHERE email=$1 AND password=$2",
          [email, password]
        );
        if (storeUserMatch.rows.length > 0) {
          // Return store role + store details
          return res.json({
            role: "store",
            user: { ...storeRow, userId: storeUserMatch.rows[0].id },
          });
        }
      }
    }

    // Not found
    res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

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
