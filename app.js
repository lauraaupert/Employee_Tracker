var mysql = require("mysql");
var inquirer = require("inquirer")
var dotenv = require("dotenv").config()

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
//   host: "localhost",
  port: 3306,
//   user: "root",
//   password: "",
  database: "employeetracker.sql"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  createProduct();
});
