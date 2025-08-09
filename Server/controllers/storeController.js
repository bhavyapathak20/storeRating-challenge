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
    res.status(500).json({ message: "Database insert error" });
  }
};

export const getStores = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM store ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Server error");
  }
};
