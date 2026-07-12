const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'greenstream',
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,
});

app.get('/api/chennai-environment-status', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM chennai_environment_status ORDER BY zone_name');
    res.json(rows);
  } catch (error) {
    console.error('MySQL query failed:', error);
    res.status(500).json({ error: 'Unable to read MySQL data' });
  }
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`MySQL API server listening on port ${port}`);
});
