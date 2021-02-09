DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db;

USE employeetracker_db;

CREATE TABLE employee (
  id INTEGER AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER,
  manager_id INTEGER,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INTEGER AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary VARCHAR(30) NOT NULL,
  department_id INTEGER,
  PRIMARY KEY (id)
);

CREATE TABLE department (
  id INTEGER AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

DELETE FROM employee WHERE employee.first_name="laura";

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ahmed", "Yoyo", 3, 100);

SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department;