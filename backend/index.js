const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Default API
app.get('/', (req, res) => {
  res.send('Backend API is working!');
});

// DB Check API
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// Webhook Test API
app.post('/webhook', (req, res) => {
  console.log("🔔 Webhook triggered:", req.body);
  res.send("Webhook received!");
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
