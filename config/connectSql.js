const mysql = require('mysql');
const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'QuanG&C13082004',
    database:'fammes',
});

module.exports = conn;
