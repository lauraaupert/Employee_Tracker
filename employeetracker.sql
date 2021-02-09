DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db;

USE employeetracker_db;

CREATE TABLE employee (
  id INTEGER AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER,
  manager_id INTEGER,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INTEGER AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary INTEGER NOT NULL,
  department_id INTEGER,
  PRIMARY KEY (id)
);

CREATE TABLE department (
  id INTEGER AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ahmed", "Yoyo", 3, 100);


UPDATE people
SET first_name = "Valhalla", manager_id = 3
WHERE id = 4;

SELECT * FROM employee;

