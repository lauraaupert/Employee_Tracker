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
  password: "",
  database: "employeetracker_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  askUser();
});


var roles = [
    "Doctor",
    "Engineer",
    "Pilot",
    "Chef",
    "Can't see what you're looking for?"
]
var managers = [
    "Albert",
    "Hortencia",
    "Daniel"
]
var departments = [
    "Health",
    "Tech",
    "Aviation",
    "Kitchen"
]

function askUser() {
    inquirer
    .prompt([
        {
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "Add employee",
            "Add department",
            "Add role",
            "Update information",
            "View information",
            "Delete information",
            "Exit"
        ]
        }
    ]).then(function(answer) {
        switch (answer.action) {
        
            case "Add employee":
                addEmployee();
            break;
            case "Add department":
                addDepartment();
            break;
            case "Add role":
                addRole();
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

function addEmployee() {
    inquirer
    .prompt([
        {
        name: "first_name",
        type: "input",
        message: "Enter employee first name"
        },
        {
        name: "last_name",
        type: "input",
        message: "Enter employee last name"
        },
        {
        name: "role_id",
        type: "rawlist",
        message: "Enter employee role.",
        choices: roles
        },
        {
        name: "manager_id",
        type: "rawlist",
        message: "Enter employee's manager",
        choices: managers
        }
    
    ])
    .then(function(response) {
        var role = roles.indexOf(response.role_id) + 1
        var manager = managers.indexOf(response.manager_id) + 1

        query = connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: response.first_name,
                last_name: response.last_name,
                role_id: role,
                manager_id: manager
            },         
            function(err) {
                if (err) throw err;
                console.table(response);
                console.log("You successfully added a new employee");
                askUser()
            }      
        )
        })  
    }

    function addDepartment() {
        inquirer
        .prompt([
            {
            name: "department_name",
            type: "input",
            message: "Enter new department name"
            },      
        ])
        .then(function(response) {
            query = connection.query(
                "INSERT INTO department SET ?",
                {
                    name: response.department_name,
                },         
                function(err) {
                    if (err) throw err;
                    console.table(response);
                    console.log("You successfully added a new department");
                    askUser()
                }      
            )
            })  
        }
        function addRole() {
            inquirer
            .prompt([
                {
                name: "title",
                type: "input",
                message: "Enter new role title"
                },
                {
                name: "salary",
                type: "input",
                message: "Enter new role salary"
                },
                {
                name: "department_id",
                type: "rawlist",
                message: "Which department does this role belong to?",
                choices: departments
                },            
            ])
            .then(function(response) {
                // var role = roles.indexOf(response.role_id) + 1
                // var manager = managers.indexOf(response.manager_id) + 1
                 var department = departments.indexOf(response.department_id) + 1
                query = connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: response.title,
                        salary: response.salary,
                        department_id: department,
                    },         
                    function(err) {
                        if (err) throw err;
                        console.table(response);
                        console.log("You successfully added a new role");
                        askUser()
                    }      
                )
                })  
            }
        
    
