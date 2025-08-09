import db from "../config/db.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  const { name, email, address, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (name, email, address, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, address, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Database insert error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Server error");
  }
};
