import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "online-store",
  password: "Passw0rd",
  port: 5432
});

db.connect();

export default db;
