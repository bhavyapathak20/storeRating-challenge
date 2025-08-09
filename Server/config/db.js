import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "online-store",
  password: "Passw0rd",
  port: 5432,
});

await db.connect();
console.log("✅ Database connected");

export default db;
