import db from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

export const createUser = async (req, res) => {
  const { name, email, address, password, isStoreOwner, store_name } = req.body;
  try {
    const hashedPassword = await hashPassword(password);

    const userResult = await db.query(
      "INSERT INTO users (name, email, address, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, address, hashedPassword]
    );

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
};

export const getUsers = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Admin check
    const adminRes = await db.query("SELECT * FROM admin WHERE admin_email = $1", [email]);
    if (adminRes.rows.length > 0) {
      const admin = adminRes.rows[0];
      const match = await comparePassword(password, admin.admin_password);
      if (match) {
        delete admin.admin_password;
        return res.json({ role: "admin", user: admin });
      }
    }

    // Normal / Store owner check
    const userRes = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userRes.rows.length > 0) {
      const user = userRes.rows[0];
      const match = await comparePassword(password, user.password);
      if (match) {
        delete user.password;
        const storeRes = await db.query("SELECT * FROM store WHERE store_email = $1", [email]);
        if (storeRes.rows.length > 0) {
          return res.json({ role: "store", user: { ...user, store: storeRes.rows[0] } });
        }
        return res.json({ role: "user", user });
      }
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
