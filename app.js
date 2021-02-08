var mysql = require("mysql");
var inquirer = require("inquirer")
var dotenv = require("dotenv").config()
var config = require("./config.js")

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

var employees = []
var roles = [
    // "Doctor",
    // "Engineer",
    // "Pilot",
    // "Chef",
    // "Can't see what you're looking for?"
]
var managers = [
    // "Albert",
    // "Hortencia",
    // "Daniel"
]
var departments = [
    // "Health",
    // "Tech",
    // "Aviation",
    // "Kitchen"
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
            "Update employee role",
            "View information",
            "Delete information",
            // "Exit"
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
        }
    })
}

function userDelete() {
    inquirer
    .prompt([
    {
        name: "employee",
        type: "rawlist",
        message: "Choose employee to delete.",
        choices: chooseEmployee()
        },
    ]).then(function(response) {
        var employee = employees.indexOf(response.employee)

    connection.query(
        "DELETE FROM employee WHERE ?",
        {
            id: employee
        },
        function(err) {
            if (err) throw err;
            console.table(response);
            console.log("You successfully deleted an employee");
            askUser()
        }      

    )
})
}

function chooseEmployee() {
    connection.query(
        "SELECT id, last_name FROM employee",
        function(err, answer) {
            if (err) throw err;
            for (var i = 0; i < answer.length; i++) {
              employees.push(answer[i].last_name);
            }
        console.log(employees)
          })
          
          return employees;

        }


function userView() {
    inquirer
    .prompt([
        {
        name: "view",
        type: "rawlist",
        message: "What information would you like view?",
        choices: [
            "Employees",
            "Departments",
            "Roles",
        ]
        }
    ]).then(function(answer) {
        switch (answer.view) {
        
            case "Employees":
                connection.query("SELECT employee.first_name, employee.last_name, employee.role_id, employee.manager_id FROM employee",
                // role.title, role.salary, department.name, FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id;",
                
                //CONCAT(e.first_name, ' ' ,e.last_name) AS manager FROM employee INNER JOIN role on role_id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
                function(err, answer) {
                    if (err) throw err;
                    console.table(answer);
                    // console.log("You successfully added a new employee");
                    askUser()
                }      
            )
            break;
            case "Departments":
                connection.query("SELECT department.name FROM department",
                // role.title, role.salary, department.name, FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id;",
                
                //CONCAT(e.first_name, ' ' ,e.last_name) AS manager FROM employee INNER JOIN role on role_id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
                function(err, answer) {
                    if (err) throw err;
                    console.table(answer);
                    // console.log("You successfully added a new employee");
                    askUser()
                }      
            )
            break;
            case "Roles":
                connection.query("SELECT role.title, role.salary, role.department_id FROM role",
                // role.title, role.salary, department.name, FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id;",
                
                //CONCAT(e.first_name, ' ' ,e.last_name) AS manager FROM employee INNER JOIN role on role_id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
                function(err, answer) {
                    if (err) throw err;
                    console.table(answer);
                    // console.log("You successfully added a new employee");
                    askUser()
                }      
            )
            break;
        }
    })
}







//     connection.query("SELECT employee.first_name, employee.last_name, employee.role_id, employee.manager_id FROM employee",
//     // role.title, role.salary, department.name, FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id;",
    
//     //CONCAT(e.first_name, ' ' ,e.last_name) AS manager FROM employee INNER JOIN role on role_id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
//     function(err, answer) {
//         if (err) throw err;
//         console.table(answer);
//         // console.log("You successfully added a new employee");
//         askUser()
//     }      
// )
// } 


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
    
    function chooseManager() {
        connection.query(
            "SELECT first_name FROM employee WHERE employee.manager_id IS NULL",
            function(err, answer) {
                if (err) throw err;
                for (var i = 0; i < answer.length; i++) {
                  managers.push(answer[i].name);
                }
            
              })
              return managers;
            }

    function chooseEmployee() {
        connection.query(
            "SELECT last_name FROM employee",
            function(err, answer) {
                if (err) throw err;
                for (var i = 0; i < answer.length; i++) {
                  employees.push(answer[i].last_name);
                }
            
              })
              
              return employees;

            }
      
                //console.table()
                //askUser()
            
    //         })                 
    // }      

    

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
      
                //console.table()
                //askUser()
            
    //         })                 
    // }      
    
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
        inquirer
        .prompt([
            {
            name: "last_name",
            type: "input",
            message: "Enter employee's last name"
            },
            {
            name: "role",
            type: "rawlist",
            message: "Enter employee's new role",
            choices: chooseRole()
            },
        ])
        .then(function(response) {
            //var role = roles.indexOf(response.role_id) + 1

            connection.query("UPDATE employee SET ? WHERE ?",
                {
                    last_name: response.last_name
                },
                {
                    role_id: response.role
                }, 
                function(err) {
        if (err) throw err;
        // console.table(response);
        console.log("You successfully updated employee's role");
        // askUser()
    
    })                 
}) 

}


    
