const mysql = require('mysql');
//connection pool
const pool = mysql.createPool({
  connectionLimit : 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});



//views users
exports.view = (req, res) => {

    pool.getConnection((err, connection) => {
      if(err) throw err;//not connected
      console.log('Connected as ID ' + connection.threadId);
      //user the connection
      connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
        //when done with the connection,realise
        connection.release();
        if(!err) {
          let removedUser = req.query.removed;
          res.render('home', { rows, removedUser });
        }else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    });
}

//find user by search
exports.find = (req, res) => {

  pool.getConnection((err, connection) => {
    if(err) throw err;//not connected
    console.log('Connected as ID ' + connection.threadId);

  let searchTerm = req.body.search;

  connection.query('SELECT * FROM user WHERE full_name LIKE ?', ['%' + searchTerm + '%'], (err, rows) => {
      //when done with the connection,realise
      connection.release();
      if(!err) {
        res.render('home', { rows });
      }else {
        console.log(err);
      }
      console.log('The data from user table: \n', rows);
    });
  });
}


exports.form = (req, res) => {
  res.render('add-employees');
}

//add new user
exports.create = (req, res) => {
  const { full_name, email, phone, dof, salary, task } = req.body;

pool.getConnection((err, connection) => {
  if(err) throw err;//not connected
  console.log('Connected as ID ' + connection.threadId);

let searchTerm = req.body.search;

connection.query('INSERT INTO user SET full_name = ?, email = ?, phone = ?, dof = ?, salary = ?, task = ?', [full_name, email, phone, dof, salary, task], (err, rows) => {
    //when done with the connection,realise
    connection.release();
    if(!err) {
      res.render('add-employees', { alert: 'Employees added successefully.' });
    }else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
});
}


//edit user
exports.edit = (req, res) => {
    pool.getConnection((err, connection) => {
      if(err) throw err;//not connected
      console.log('Connected as ID ' + connection.threadId);
      //user the connection
      connection.query('SELECT * FROM user WHERE id = ?',[req.params.id], (err, rows) => {
        //when done with the connection,realise
        connection.release();
        if(!err) {
          res.render('edit-user', { rows });
        }else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    });
}

//update employee
exports.update = (req, res) => {
  const { full_name, email, phone, dof, salary, task } = req.body;

    pool.getConnection((err, connection) => {
      if(err) throw err;//not connected
      console.log('Connected as ID ' + connection.threadId);
      //user the connection
      connection.query('UPDATE user SET full_name = ?, email = ?, phone = ?, dof = ?, salary = ?, task = ? WHERE id = ?', [full_name, email, phone, dof, salary, task, req.params.id], (err, rows) => {

        if(!err) {
          pool.getConnection((err, connection) => {
            if(err) throw err;//not connected
            console.log('Connected as ID ' + connection.threadId);
            //user the connection
            connection.query('SELECT * FROM user WHERE id = ?',[req.params.id], (err, rows) => {
              //when done with the connection,realise
              connection.release();
              if(!err) {
                res.render('edit-user', { rows, alert: `${full_name} hass been updated.` });
              }else {
                console.log(err);
              }
              console.log('The data from user table: \n', rows);
            });
          });

        }else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    });
}


//delete employee
exports.delete = (req, res) => {
  //  pool.getConnection((err, connection) => {
  //    if(err) throw err;//not connected
  //    console.log('Connected as ID ' + connection.threadId);

      //user the connection
  //    connection.query('DELETE FROM user WHERE id = ?',[req.params.id], (err, rows) => {
        //when done with the connection,realise
  //      connection.release();
  //      if(!err) {
  //        res.redirect('/');
  //      }else {
  //        console.log(err);
  //      }
  //      console.log('The data from user table: \n', rows);
  //    });
  //  });

  pool.getConnection((err, connection) => {
    if(err) throw err;
connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {      //when done with the connection,realise
  if (!err) {
 let removedUser = encodeURIComponent('User successeflly removed.');
 res.redirect('/?removed=' + removedUser);
} else {
 console.log(err);
}
console.log('The data from beer table are: \n', rows);
});
});
}




//views users
exports.viewall = (req, res) => {

    pool.getConnection((err, connection) => {
      if(err) throw err;//not connected
      console.log('Connected as ID ' + connection.threadId);
      //user the connection
      connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        //when done with the connection,realise
        connection.release();
        if(!err) {
          res.render('view-user', { rows });
        }else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    });
}
