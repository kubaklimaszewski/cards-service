const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  client_encoding: 'UTF-8'
});

pool.on("error", (err) => {
  console.error("Unexpected PG client error", err);
  process.exit(1);
});

module.exports = pool;
