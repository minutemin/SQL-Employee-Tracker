// require inquirer and mysql2
const inquirer = require('inquirer');
const mysql = require('mysql2');

// connect to mysql database
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'sqlThis',
        database: 'employee_db'
    },
    console.log("Connecting to the employee_db!")
);
// function for displaying the departments
async function displayDepartments() {
    db.query("SELECT * FROM departments", function (err, results) {
        if (err) {
            console.log(err);
        } 
        console.log("Here is a table of all of the Departments");
        console.table(results);
        handleOptions();
    });
}
// function for displaying the roles
async function displayRoles() {
    db.query("SELECT * FROM roles", function (err, results) {
        if (err) {
            console.log(err);
        } 
        console.table(results);
        handleOptions();
    });
}
// function for displaying the Employees
async function displayEmployees() {
    // create variable sql for the prepared statements
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
// function for adding a new department
async function addDept() {
    // create variable to prompt inquirer questions for the new department name
    const addDeptQuestions = await inquirer.prompt ([
        {
            type: "input",
            name: "newDept",
            message: "What is the name of the Department you want to add?"
        }
    ]);
    // create sql variable with prepared statement to insert new department into the department table
    const sql = "INSERT INTO departments (department_name) VALUES (?)";
    // create a params variable to identify the parameters 
    const params = addDeptQuestions.newDept;

    db.query(sql, params, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        handleOptions();
    });
}
// functio to add new roles to the roles table
async function addRole() {
    // create in [] a variable that awaits a promise query to list all of the departments from the departments table
    const [deptList] = await db.promise().query("SELECT * FROM departments");
    // create another variable to loop using map through the deptList and destruct the objects {} 
    let showDept = deptList.map(({ id, department_name }) => ({
        // list the objects you want to listed here
        name: department_name,
        value: id,
        })
    );
    // create variable for the inquirer questions and include the choices for the dept list
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
            choices: showDept
        }
    ]);
    // variable for sql for the insert prepared statement for the roles table
    const sql = "INSERT INTO roles SET ?";
    
    db.query(sql, addRoleQuestion, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        handleOptions();
    });
}
// function for adding new employees
async function addEmployee() {
    // create in [] a variable that awaits a promise query to list all of the roles from the roles table
    const [rolesList] = await db.promise().query("SELECT * FROM roles");
    // create another variable to loop using map through the roles list and destruct the objects {} 
    let showRoles = rolesList.map(({ id, title }) =>
        ({
            name: title,
            value: id,
        })
    );
    // create in [] a variable that awaits a promise query to list all of the employees from the employees table
    const [employeeList] = await db.promise().query("SELECT * FROM employees");
    // create another variable to loop using map through the employees list and destruct the objects {} 
    let showEmp = employeeList.map(({ id, first_name, last_name, }) =>
        ({
            name: first_name + " " + last_name,
            value: id,
        })
    );
    // create variable for the inquirer questions and include the choices for the new employee
    const addEmployeeQuestion = await inquirer.prompt ([
        {
            type: "input",
            name: "first_name",
            message: "What is the first name of the new Employee?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the last name of the new Employee?"
        },
        {
            type: "list",
            name: "role_id",
            message: "What is the role of the new Employee?",
            choices: showRoles
        },
        {
            type: "list",
            name: "manager_id",
            message: "Who is the manager of this new Employee?",
            choices: showEmp
        }
    ]);

    // variable for sql for the insert prepared statement for the employees table
    const sql = "INSERT INTO employees SET ?";

    db.query(sql, addEmployeeQuestion, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        handleOptions();
    });

}
// function to update employee's role
async function updateEmployee() {
    // create in [] a variable that awaits a promise query to list all of the employees from the employees table
    const [employeeList] = await db.promise().query("SELECT * FROM employees");
    // create another variable to loop using map through the employee's list and destruct the objects {} 
    let showEmp = employeeList.map(({ id, first_name, last_name, }) =>
        ({
            name: first_name + " " + last_name,
            value: id,
        })
    );
    // create in [] a variable that awaits a promise query to list all of the roles from the roles table
    const [rolesList] = await db.promise().query("SELECT * FROM roles");
    // create another variable to loop using map through the role's list and destruct the objects {} 
    let showRoles = rolesList.map(({ id, title }) =>
        ({
            name: title,
            value: id,
        })
    );
    // prompt questions with inquirer to ask for employee and role updates
    const updateEmpQuestions = await inquirer.prompt ([
        {
            type: "list",
            name: "id",
            message: "Which employee do you want to update?",
            choices: showEmp
        },
        {
            type: "list",
            name: "role_id",
            message: "Which role do you the employee updated to?",
            choices: showRoles
        }
    ]);
    // update prepared statement for employees role
    const sql = "UPDATE employees SET role_id = ? WHERE id = ?";
    const params = [updateEmpQuestions.role_id, updateEmpQuestions.id]

    db.query(sql, params, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        handleOptions();
    });
}
// BONUS function to delete an Employee
async function deleteEmployee() {
    const [empList] = await db.promise().query("SELECT * FROM employees");
    let showEmps = empList.map(({ id, first_name, last_name}) => ({
        name: first_name + last_name,
        value: id,
        })
    );

    let deleteQuestion = await inquirer.prompt ([
        {
            type: "list",
            name: "id",
            message: "Which Employee do you want to delete?",
            choices: showEmps
            
        }
    ]);

    const sql = "DELETE FROM employees WHERE id = ?";
    const params = deleteQuestion.id;

    db.query(sql, params, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        handleOptions();
    });
}
// BONUS function to delete a Role!
async function deleteRole() {
    const [empList] = await db.promise().query("SELECT * FROM roles");
    let showRoles = empList.map(({ id, title}) => ({
        name: title,
        value: id,
        })
    );

    let deleteQuestion = await inquirer.prompt ([
        {
            type: "list",
            name: "id",
            message: "Which Role do you want to delete?",
            choices: showRoles
            
        }
    ]);

    const sql = "DELETE FROM roles WHERE id = ?";
    const params = deleteQuestion.id;

    db.query(sql, params, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        handleOptions();
    });
}
// BONUS function for deleting Departments
async function deleteDepartment() {
    const [empList] = await db.promise().query("SELECT * FROM departments");
    let showDept = empList.map(({ id, department_name}) => ({
        name: department_name,
        value: id,
        })
    );

    let deleteQuestion = await inquirer.prompt ([
        {
            type: "list",
            name: "id",
            message: "Which Department do you want to delete?",
            choices: showDept
            
        }
    ]);

    const sql = "DELETE FROM departments WHERE id = ?";
    const params = deleteQuestion.id;

    db.query(sql, params, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        handleOptions();
    });
}


// function to prompt the main menu
async function handleOptions() {
    const options = [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee's Role", 
        "Delete an Employee",
        "Delete a Role",
        "Delete a Department"
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
    } else if (results.command == "Add an Employee") {
        addEmployee();
    } else if (results.command == "Update an Employee's Role") {
        updateEmployee();
    } else if (results.command == "Delete an Employee") {
        deleteEmployee();
    } else if (results.command == "Delete a Role") {
        deleteRole();
    } else if (results.command == "Delete a Department") {
        deleteDepartment();
    }   
}

handleOptions();


/*

async function handleOptions() {
    const results = await inquirer.prompt([
        {
            type: "list",
            name: "command",
            message: "what would you like to do?",
            choices: options,
        },
    ]);
    switch (results.command) {
                case "View All Departments":
                    displayDepartments();
                case "View All Roles":
                    displayRoles();
                case "View All Employees":
                    displayEmployees();
                case "Add a Department":
                    addDept();
                case "Add a Role":
                    addRole();
                case "Add an Employee":
                    addEmployee();
                case "Update an Employee's Role":
                    updateEmployee();
                case "Delete an Employee":
                    deleteEmployee();
                case "Delete a Role":
                    deleteRole();
                case "Delete a Department":
                    deleteDepartment();
        }
  
}
handleOptions();

*/
    