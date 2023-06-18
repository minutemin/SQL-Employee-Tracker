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

    const [deptList] = await db.promise().query("SELECT * FROM departments");
    // Create another variable to loop using map through the deptList and destructer the objects {} 
    const showCase = deptList.map(({ id, department_name }) => ({
        // list the objects you want to list here
        name: department_name,
        value: id,
        })
    );
    // console.log(deptList);
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
            choices: showCase
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

async function addEmployee() {
    const [rolesList] = await db.promise().query("SELECT * FROM roles");
    const showRoles = rolesList.map(({ id, title }) =>
        ({
            name: title,
            value: id,
        })
    );

    const [employeeList] = await db.promise().query("SELECT * FROM employees");
    const showEmp = employeeList.map(({ id, first_name, last_name, }) =>
        ({
            name: first_name + " " + last_name,
            value: id,
        })
    );

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
    const sql = "INSERT INTO employees SET ?";
    
    
    db.query(sql, addEmployeeQuestion, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        handleOptions();
    });

}



async function updateEmployee() {
    const [employeeList] = await db.promise().query("SELECT * FROM employees");
    const showEmp = employeeList.map(({ id, first_name, last_name, }) =>
        ({
            name: first_name + " " + last_name,
            value: id,
        })
    );

    const [rolesList] = await db.promise().query("SELECT * FROM roles");
    const showRoles = rolesList.map(({ id, title }) =>
        ({
            name: title,
            value: id,
        })
    );

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

async function deleteEmployee() {
    const [empList] = await db.promise().query("SELECT * FROM employees");
    const showEmps = empList.map(({ id, first_name, last_name}) => ({
        name: first_name + last_name,
        value: id,
        })
    );

    const deleteQuestion = await inquirer.prompt ([
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


async function handleOptions() {
    const options = [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee's Role", 
        "Delete an Employee"
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
    }
 
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



/*

async function deleteEmployee() {
    const [empList] = await db.promise().query("SELECT * FROM employees");
    const showEmps = empList.map(({ id, first_name, last_name}) => ({
        name: first_name + last_name,
        value: id,
        })
    );

    const deleteQuestion = await inquirer.prompt ([
        {
            type: "list",
            name: "id",
            message: "Which Employee do you want to delete?",
            choices: showEmps
            
        }
    ]);

    const sql = "DELETE FROM employees WHERE id = ?";

    db.query(sql, deleteQuestion, (err, results) => {
        if (err) {
            message: "Employee not found"
            console.log(err);
        } else {(
            {
                message: "Deleted!",
                changes: results.affectedRows,
                id: req.params.id
            });
        }
        console.table(results);
        handleOptions();
    });
}
*/



    