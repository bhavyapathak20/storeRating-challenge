import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pg from 'pg';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new pg.Client({
    user : "postgres",
    host : "localhost",
    database : "online-store",
    password : "Passw0rd",
    port : 5432
});

db.connect()

app.post("/api/users", async (req, res) =>{
    const {name, email, address, password} = req.body;

    try {
    const result = await db.query(
      "INSERT INTO users (name, email, address, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, address, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database insert error" });
  }
});

app.post('/api/store', async(req,res) =>{
  const {store_name, store_owner, store_email, store_address} = req.body;

  try{
    const result = await db.query('INSERT INTO store (store_name, store_owner, store_email, store_address) VALUES ($1, $2, $3, $4) RETURNING *',
      [store_name, store_owner, store_email, store_address]
    );
    res.status(201).json(result.rows[0]);
  }catch(err){
    console.log(err);
    res.status(500).json({message : "Database insert error"});
  }
})

app.post('/api/admin', async (req, res) => {
  const { admin_name, admin_email, admin_address, admin_password } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO admin (admin_name, admin_email, admin_address, admin_password) VALUES ($1, $2, $3, $4) RETURNING *',
      [admin_name, admin_email, admin_address, admin_password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Database insert error:", err);
    res.status(500).json({ message: "Database insert error" });
  }
});

app.get('/api/users', async(req,res) =>{
  try{
    const result = await db.query('SELECT * FROM users ORDER BY id ASC');
    res.json(result.rows);
  }catch(err){
    console.error(err.message);
    res.status(500).send("Server error");
  }
})

app.get('/api/stores', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM store ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).send("Server error");
  }
});

app.get('/api/users/count', async (req, res) => {
  try {
    const result = await db.query("SELECT COUNT(*) FROM users");
    res.json({ total: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
