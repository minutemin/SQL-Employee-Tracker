const inquirer = require('inquirer');
// const express = require('express');
const mysql = require('mysql2');

//TODO connect to mysql database
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'sqlThis',
        database: 'employee_db'
    },
    console.log("Connecting to the employee_db.")
);

async function displayDepartments() {
    // TODO implement a function to select all departmentsfor mySql
    db.query("SELECT * FROM departments", function (err, results) {
        console.log(results);
    });

    // db.query(sql, (err, rows) => {
    //     if (err) {
    //         res.status(500).json({ error: err.message});
    //         return;
    //     }   
    //     console.log(rows);
    //     res.json({
    //         message: "success",
    //         data: rows
    //     }); 
    // });
};




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