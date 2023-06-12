const inquirer = require('inquirer');
const mysql = require('mysql2');

//TODO connect to mysql database
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'sqlThis',
        database: 'employee_db'
    },
    console.log("Connecting to the employee_db!")
);

async function displayDepartments() {
    db.query("SELECT * FROM departments", function (err, results) {
        if (err) {
            console.log(err);
        } 
        console.table(results);
    });
}

async function displayRoles() {
    db.query("SELECT * FROM roles", function (err, results) {
        if (err) {
            console.log(err);
        } 
        console.table(results);
    });
}

async function displayEmployees() {
    const sql = `
    SELECT employees.id AS "Employee ID",
    employees.first_name AS "First Name",
    employees.last_name AS "Last Name",
    roles.title AS "Title",
    departments.department_name AS "Department",
    roles.salary AS "Salary",
    CONCAT (manager.first_name, " ", manager.last_name, "") AS "Manager"
    FROM employees
    LEFT JOIN roles ON (employees.role_id = roles.id)
    LEFT JOIN departments ON (roles.department_id = departments.id)
    LEFT JOIN employees manager ON employees.manager_id = manager.id;
    `;
    db.query(sql, function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
    });
}

async function handleOptions() {
    const options = [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add a Department",
        "Add a Role",
        "Add a Employee",
        "Update an Employee's Role"
    ]

    const results = await inquirer.prompt([{
        message: "What would you like to do?",
        name: "command",
        type: "list",
        choices: options,
    }]);
    if (results.command == "View All Departments") {
        displayDepartments();
        handleOptions();
    } else if (results.command == "View All Roles") {
        displayRoles();
        handleOptions();
    } else if (results.command == "View All Employees") {
        displayEmployees();
        handleOptions();
    } 
    // TODO implement the rest of these
}

handleOptions();