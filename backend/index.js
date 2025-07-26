const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend API is working!');
});

app.get('/api/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`⏱️ DB Timestamp: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Database error');
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
