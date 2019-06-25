const express = require('express');
const mysql = require('mysql');

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    ///////////////////step 2//////////////////////
    /////////////uncomment after step 1/////////////////////
    // database : 'apps_list'
});

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

const app = express();

///////////////////step 1//////////////////////
// Create DB
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE apps_list';
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            throw err;
          }
        console.log(result);
        res.send('Database created...');
    });
});


///////////////////step 3//////////////////////
// Create apps table//
app.get('/createappstable', (req, res) => {
  let sql = 'CREATE TABLE apps(appId int AUTO_INCREMENT, title VARCHAR(255), description VARCHAR(255), imgDir VARCHAR(255), androidUrl VARCHAR(255), iosUrl VARCHAR(255), PRIMARY KEY(appId))';
  db.query(sql, (err, result) => {
      if(err) {
        console.log(err);
        throw err;
      }
      console.log(result);
      res.send('apps table created...');
  });
});

app.listen('3000', () => {
    console.log('Server started on port 3000');
});
