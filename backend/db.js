const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'apps_list'
});

db.connect((err) => {
  if(err)
    throw err;
  console.log('connected to mysql db apps_list')
});

module.exports = db;
