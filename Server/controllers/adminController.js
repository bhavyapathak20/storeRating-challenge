import db from "../config/db.js";
import { hashPassword } from "../utils/hash.js";

export const createAdmin = async (req, res) => {
  const { admin_name, admin_email, admin_address, admin_password } = req.body;
  try {
    const hashedPassword = await hashPassword(admin_password);
    const result = await db.query(
      "INSERT INTO admin (admin_name, admin_email, admin_address, admin_password) VALUES ($1, $2, $3, $4) RETURNING *",
      [admin_name, admin_email, admin_address, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Database insert error:", err);
    res.status(500).json({ message: "Database insert error" });
  }
};

export const getStats = async (req, res) => {
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
};
