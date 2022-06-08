const Pool = require("pg").Pool;

const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "yeezy_rumors_dev",
  password: "password",
  port: 5432,
});

const getRumors = async () => {
  const res = await pool.query("SELECT * FROM rumors ORDER BY id ASC");
  return res.rows;
};

// const createUser = (request, response) => {
//   const { name, email } = request;
//   pool.query(
//     "INSERT INTO users (name, email) VALUES ($1, $2)",
//     [name, email],
//     (error, results) => {
//       if (error) {
//         throw error;
//       }
//       response.status(201).send(`User added with ID: ${results.insertId}`);
//     }
//   );
// };

const createUser = (request, response) => {
  const { name, email } = request;
  pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [name, email]);
};

module.exports = {
  getRumors,
  createUser,
};
