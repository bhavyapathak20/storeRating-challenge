import db from "./db.js";

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
`).then(() => {
  console.log("✅ Ratings table ensured");
}).catch((e) => {
  console.error("❌ Could not create ratings table:", e);
});
