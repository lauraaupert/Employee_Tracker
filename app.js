var mysql = require("mysql");
var inquirer = require("inquirer")
var dotenv = require("dotenv").config()
var config = require("./config.js");
const { Server } = require("http");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Ivegotmysql123",
  database: "employeetracker_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  askUser();
});

var roles = []
var managers = []
var departments = []

function askUser() {
    inquirer
    .prompt([
        {
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "Add department",
            "Add role",
            "Add employee",
            "Update employee role",
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
            case "Update employee role":
                userUpdate();
            break;
            case "View information":
                userView();
            break;
            case "Delete information":
                userDelete();
            break;
            case "Exit":
                process.exit()
            break;
        }
    })
}

function userDelete() {
    inquirer
    .prompt([
        {
        name: "view",
        type: "rawlist",
        message: "What information would you like to delete?",
        choices: [
            "Employees",
            "Departments",
            "Roles"
        ]
        }
    ]).then(function(answer) {
        switch (answer.view) {
            case "Employees":
                deleteEmployee()
            break;
            case "Departments":
                deleteDepartments()
            break;
            case "Roles":
                deleteRoles()
            break;
        }
    })
}

function deleteEmployee() {
    connection.query("SELECT employee.last_name FROM employee", function(err, answer) {
         if (err) throw err;
    inquirer
    .prompt([
    {
        name: "employee",
        type: "rawlist",
        message: "Choose employee to delete.",
        choices: function() {
            var lastName = [];
            for (var i = 0; i < answer.length; i++) {
              lastName.push(answer[i].last_name);
            }
            return lastName;
          },
    },
    ]).then(function(response) {
        connection.query(
        "DELETE FROM employee WHERE ?",
        {
            last_name: response.employee
        },
        function(err) {
            if (err) throw err;
            console.table(response);
            console.log("You successfully deleted an employee");
            askUser()
        })
        })
    })
}

function deleteDepartments() {
    connection.query("SELECT name FROM department", function(err, answer) {
         if (err) throw err;
    inquirer
    .prompt([
    {
        name: "department",
        type: "rawlist",
        message: "Choose department to delete.",
        choices: function() {
            var department = [];
            for (var i = 0; i < answer.length; i++) {
              department.push(answer[i].name);
            }
            return department;
        },
    },
    ]).then(function(response) {
    connection.query(
        "DELETE FROM department WHERE ?",
        {
            name: response.department
        },
        function(err) {
            if (err) throw err;
            console.table(response);
            console.log("You successfully deleted a department");
            askUser()
        })
    })
    })
}

function deleteRoles() {
    connection.query("SELECT role.title FROM role", function(err, answer) {
         if (err) throw err;
    inquirer
    .prompt([
    {
        name: "role",
        type: "rawlist",
        message: "Choose role to delete.",
        choices: function() {
            var role = [];
            for (var i = 0; i < answer.length; i++) {
              role.push(answer[i].title);
            }
            return role;
        },
    },
    ]).then(function(response) {
    connection.query(
        "DELETE FROM role WHERE ?",
        {
            title: response.role
        },
        function(err) {
            if (err) throw err;
            console.table(response);
            console.log("You successfully deleted a role");
            askUser()
        })
    })
    })
}

function userView() {
    inquirer
    .prompt([
        {
        name: "view",
        type: "rawlist",
        message: "What information would you like to view?",
        choices: [
            "Employees",
            "Departments",
            "Roles",
        ]
        }
    ]).then(function(answer) {
        switch (answer.view) {
            case "Employees":
                connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department on department.id = role.department_id",
                function(err, answer) {
                    if (err) throw err;
                    console.table(answer);
                    askUser()
                }      
            )
            break;
            case "Departments":
                connection.query("SELECT department.name AS department, role.title, role.salary, employee.first_name, employee.last_name FROM department LEFT JOIN role on role.department_id = department.id LEFT JOIN employee on employee.role_id = role.id ORDER BY department.id",
                function(err, answer) {
                    if (err) throw err;
                    console.table(answer);
                    askUser()
                }      
            )
            break;
            case "Roles":
                connection.query("SELECT role.title, role.salary, department.name AS department FROM role LEFT JOIN department on role.department_id = department.id ORDER BY role.id",
                function(err, answer) {
                    if (err) throw err;
                    console.table(answer);
                    askUser()
                }      
            )
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
        choices: chooseRole()
        },
        // {
        // name: "manager_id",
        // type: "rawlist",
        // message: "Enter employee's manager",
        // choices: chooseManager()
        // }
    
    ])
    .then(function(response) {
        var role = roles.indexOf(response.role_id) +1
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
            choices: chooseDepartment()
            },            
        ])
        .then(function(response) {
            var department = departments.indexOf(response.department_id) +1
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
    
function chooseDepartment() {
    connection.query(
        "SELECT name FROM department",
            function(err, answer) {
                if (err) throw err;
                for (var i = 0; i < answer.length; i++) {
                  departments.push(answer[i].name);
                }
            })
              return departments;
}
    
function chooseRole() {
    connection.query("SELECT * FROM role", function(err, answer) {
        if (err) throw err
        for (var i = 0; i < answer.length; i++) {
        roles.push(answer[i].title);
        }
    })
        return roles;
}

function userUpdate() {
    connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", 
        function(err, answer) {
            if (err) throw err;
            console.log(answer)
        inquirer
        .prompt([
            {
            name: "employee",
            type: "rawlist",
            message: "Choose employee to update.",
            choices: function() {
                var lastName = [];
                for (var i = 0; i < answer.length; i++) {
                  lastName.push(answer[i].last_name);
                }
                return lastName;
              },
            },
            {
                name: "role",
                type: "rawlist",
                message: "Enter employee's new role",
                choices: chooseRole()
            },
        ])
        .then(function(response) {
            var role = roles.indexOf(response.role) + 1
            connection.query("UPDATE employee SET ? WHERE ?",
            [    
                {
                    role_id: role
                },
                {
                    last_name: response.employee
                },
            ], 
            function(err) {
                if (err) throw err;
                console.table(response);
                console.log("You successfully updated employee's role");
                askUser()
            })                 
        }) 
    })
}


    
