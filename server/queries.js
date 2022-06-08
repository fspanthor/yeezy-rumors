const Pool = require("pg").Pool;

const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "yeezy_rumors_dev",
  password: "password",
  port: 5432,
});

const getRumors = async () => {
  const res = await pool.query("SELECT * FROM rumors ORDER BY id DESC");
  return res.rows;
};

const createRumor = (request, response) => {
  const { rumorContent } = request;
  pool.query("INSERT INTO rumors (rumor_content) VALUES ($1)", [rumorContent]);
};

module.exports = {
  getRumors,
  createRumor,
};
