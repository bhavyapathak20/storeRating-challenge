import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import db from "./config/db.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Original working endpoints
app.use("/api/users", userRoutes);      // GET /api/users
app.use("/api/stores", storeRoutes);    // GET /api/stores (plural to match frontend)
app.use("/api/admin", adminRoutes);     // POST admin, GET stats
app.use("/api", authRoutes);            // POST /api/login

// ✅ Old users count route
app.get("/api/users/count", async (req, res) => {
  try {
    const result = await db.query("SELECT COUNT(*) FROM users");
    res.json({ total: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// ✅ Old stores count route
app.get("/api/stores/count", async (req, res) => {
  try {
    const result = await db.query("SELECT COUNT(*) FROM store");
    res.json({ total: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// ✅ Unified stats route for dashboard cards
app.get("/api/stats", async (req, res) => {
  try {
    const totalUsers = await db.query("SELECT COUNT(*) FROM users");
    const totalStores = await db.query("SELECT COUNT(*) FROM store");
    const totalRatings = await db.query("SELECT COUNT(*) FROM ratings");

    res.json({
      total_users: parseInt(totalUsers.rows[0].count, 10),
      total_stores: parseInt(totalStores.rows[0].count, 10),
      total_ratings: parseInt(totalRatings.rows[0].count, 10),
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
