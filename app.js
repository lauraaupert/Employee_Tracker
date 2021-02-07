var mysql = require("mysql");
var inquirer = require("inquirer")
var dotenv = require("dotenv").config()

var connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASS,
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Raphael08!",
  database: "employeetracker_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  askUser();
});

function askUser() {
    inquirer
    .prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "Add employee",
            "Update information",
            "View information",
            "Delete information"
        ]
    }).then(function(answer) {
        switch (answer.action) {
        
            case "Add employee":
                userAdd();
            break;
            case "Update information":
                userUpdate();
            break;
            case "View information":
                userView();
            break;
            case "Delete information":
                userDelete();
            break;
        }
    })
}

function userAdd() {
    inquirer
    .prompt(
        {
        name: "first_name",
        type: "input",
        message: "Enter employee first name."
        },
        {
        name: "last_name",
        type: "input",
        message: "Enter employee last name."
        },
        {
        name: "role_id",
        type: "rawlist",
        message: "Enter employee role.",
        choices: [
            "Doctor",
            "Engineer",
            "Pilot",
            "Chef",
            "Can't see what you're looking for?"
        ]
        })
    .then(function(response) {
        var query = connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: response.first_name,
                last_name: response.last_name,
                role_id: response.role_id
            },         
            function(err) {
                if (err) throw err;
                console.log("Your auction was created successfully!");
                // re-prompt the user for if they want to bid or post
            }      
        )
      console.log(query)
        })  
    }

