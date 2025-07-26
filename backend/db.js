const { Pool } = require('pg');

const pool = new Pool({
  user: 'myuser',
  host: 'postgres-db',        // docker container name
  database: 'myappdb',
  password: 'mypassword',
  port: 5432,
});

module.exports = pool;
