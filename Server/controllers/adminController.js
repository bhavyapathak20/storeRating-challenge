import db from "../config/db.js";
import bcrypt from "bcrypt";

export const createAdmin = async (req, res) => {
  const { admin_name, admin_email, admin_address, admin_password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(admin_password, 10);
    const result = await db.query(
      "INSERT INTO admin (admin_name, admin_email, admin_address, admin_password) VALUES ($1, $2, $3, $4) RETURNING *",
      [admin_name, admin_email, admin_address, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Database insert error" });
  }
};

export const getStats = async (req, res) => {
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
};
