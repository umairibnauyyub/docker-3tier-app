const express = require('express');
const cors = require('cors'); // <== ADD THIS
const pool = require('./db');

const app = express();
app.use(cors()); // <== ADD THIS
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend API is working!');
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
