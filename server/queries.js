//const Pool = require("pg").Pool;
const { Pool } = require("pg");

//console.log(new Client().pool);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// const pool = new Pool({
//   user: "me",
//   host: "localhost",
//   database: "yeezy_rumors_dev",
//   password: "password",
//   port: 5432,
// });

const getRumors = async () => {
  const res = await pool.query("SELECT * FROM rumors ORDER BY id DESC");
  return res.rows;
};

const createRumor = async (request) => {
  const { rumorContent } = request;
  const res = await pool.query(
    "INSERT INTO rumors (rumor_content) VALUES ($1)",
    [rumorContent]
  );
  return res.rowCount;
};

module.exports = {
  getRumors,
  createRumor,
};
