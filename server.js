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
        //TODO refer to roles table
    }
    // TODO implement the rest of these
}

handleOptions();