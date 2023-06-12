INSERT INTO departments (department_name)
VALUES ("Management"),
        ("Engineering"),
        ("Sales"),
        ("Security"),
        ("Maintenance");


INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 175000, 1),
       ("Front End Development", 95000, 2),
       ("Back End Development", 95000, 2),
       ("Online Sales", 65000, 3),
       ("Customer Service Sales", 96000, 3),
       ("Cyber Security Advisor", 195000, 4),
       ("Cyber Security Engineer", 155000, 4),
       ("Custodian", 75000, 5),
       ("Repairman", 75000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Barry", "Beredee", 1, 1),
       ("Sally", "Golong", 1, 2),
       ("Bob", "Loblaw", 1, 3),
       ("Cynthia", "Beginning", 1, 4),
       ("Courtney", "Act", 2, 1),
       ("Penny", "Furerthots", 2, 1),
       ("Sam", "Eyam", 3, 1),
       ("Sia", "Sunnoralaiter", 3, 1),
       ("Frank", "Mehaiybe", 4, 2),
       ("Bette", "Terbeready", 4, 2),
       ("Nancy", "Fancypants", 5, 2),
       ("Lottie", "Dottieda", 5, 2),
       ("Kitty", "Sanchez", 6, 3),
       ("Bud", "Cort", 7, 3),
       ("Mary", "Doyuanna", 8, 4),
       ("Darren", "Teccarrisk", 9, 4);