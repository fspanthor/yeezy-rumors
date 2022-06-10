const { Pool } = require("pg");
const { developmentDbConnection } =
  process.env.NODE_ENV !== "production" && require("./developmentDbConnection");

const env = process.env.NODE_ENV;

const pool =
  env === "production"
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      })
    : new Pool(developmentDbConnection());

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
