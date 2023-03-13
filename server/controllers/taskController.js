
const mysql = require('mysql');
//connection pool
const pool = mysql.createPool({
  connectionLimit : 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});



// Example controller using the database connection
exports.view = (req, res) => {
  db.query('SELECT * FROM task WHERE id = ? status = "active"', [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(results[0]);
  });
};
