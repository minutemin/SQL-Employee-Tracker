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
        handleOptions();
    });
}

async function displayRoles() {
    db.query("SELECT * FROM roles", function (err, results) {
        if (err) {
            console.log(err);
        } 
        console.table(results);
        handleOptions();
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
        handleOptions();
    });
}

async function addDept() {
    const addDeptQuestions = await inquirer.prompt ([
        {
            type: "input",
            name: "newDept",
            message: "What is the name of the Department you want to add?"
        }
    ]);
    const sql = "INSERT INTO departments (department_name) VALUES (?)";
    const params = addDeptQuestions.newDept;

    db.query(sql, params, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        handleOptions();
    });
}

async function addRole() {

    // const deptList = await db.promise().query("SELECT * FROM departments");

    const addRoleQuestion = await inquirer.prompt ([
        {
            type: "input",
            name: "title",
            message: "What is the title of the new role?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of this postion?"
        },
        {
            type: "list",
            name: "department_id",
            message: "What is the department this role belongs to?",
            choices: await db.promise().query("SELECT * FROM departments")
        }
    ]);
    const sql = "INSERT INTO roles SET ?";
    

    db.query(sql, addRoleQuestion, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        handleOptions();
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

    const results = await inquirer.prompt([
        {
            type: "list",
            name: "command",
            message: "what would you like to do?",
            choices: options,
        },
    ]);

    if (results.command == "View All Departments") {
        displayDepartments();
    } else if (results.command == "View All Roles") {
        displayRoles();
    } else if (results.command == "View All Employees") {
        displayEmployees();
    } else if (results.command == "Add a Department") {
        addDept();
    } else if (results.command == "Add a Role") {
        addRole();
    }
    // TODO implement the rest of these
}   

handleOptions();


/*

async function deleteDeptName() {
    const deleteDeptQuestion = await inquirer.prompt ([
        {
            type: "list",
            name: "deleteDept",
            message: "What department do you want to delete?",
            choices: options,
            
        }
    ])
}





    */