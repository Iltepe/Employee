const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//parsing middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

//parse application/json
app.use(bodyParser.json());

//static files
app.use(express.static('public'));

// teplating engine
app.engine('.hbs', exphbs.engine({ extname: '.hbs'}));
app.set('view engine', 'hbs');

//connection pool
const pool = mysql.createPool({
  connectionLimit : 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

//connect to db
pool.getConnection((err, connection) => {
  if(err) throw err;//not connected
  console.log('Connected as ID ' + connection.threadId);
});

const taskRoutes = require('./server/routes/task');
app.use('/task', taskRoutes);

const userRoutes = require('./server/routes/user');
app.use('/', userRoutes);




app.listen(port, () => console.log(`Listening on port ${port}`));
