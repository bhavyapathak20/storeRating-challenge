import db from "../config/db.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Admin login
  const adminRes = await db.query(
    "SELECT * FROM admin WHERE admin_email = $1",
    [email]
  );
  if (adminRes.rows.length > 0) {
    const match = await bcrypt.compare(password, adminRes.rows[0].admin_password);
    if (match) {
      delete adminRes.rows[0].admin_password;
      return res.json({ role: "admin", user: adminRes.rows[0] });
    }
  }

  // User / Store Owner login
  const userRes = await db.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  if (userRes.rows.length > 0) {
    const match = await bcrypt.compare(password, userRes.rows[0].password);
    if (match) {
      delete userRes.rows[0].password;

      const storeRes = await db.query(
        "SELECT * FROM store WHERE store_email = $1",
        [email]
      );
      if (storeRes.rows.length > 0) {
        return res.json({ role: "store", user: userRes.rows[0] });
      }
      return res.json({ role: "user", user: userRes.rows[0] });
    }
  }

  return res.status(401).json({ message: "Invalid credentials" });
};
