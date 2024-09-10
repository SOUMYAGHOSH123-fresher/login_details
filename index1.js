const inquirer = require('inquirer');
const fs = require('fs')
const prompt = inquirer.default.prompt;

let employees = [];

const mainMenu = async () => {
    const answers = await prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['Add Employee', 'Update Salary', 'List Employees','Delete Employee' ,'Exit'],
        },
    ]);

    switch (answers.action) {
        case 'Add Employee':
            await addEmployee();
            break;
        case 'Update Salary':
            await updateSalary();
            break;
        case 'List Employees':
            listEmployees();
            break;
        case 'Delete Employee':
            deleteEmployee();
            break;
        case 'Exit':
            console.log('Goodbye!');
            return;
    }

    mainMenu();
};

const addEmployee = async () => {
    const answers = await prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the employee name:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the employee salary:',
            validate: (value) => {
                const valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number';
            },
            filter: Number,
        },
    ]);

    employees.push({ name: answers.name, salary: answers.salary });
    fs.writeFileSync('salaries.json', JSON.stringify(employees, null, 2));
    console.log(`Employee ${answers.name} added with salary ${answers.salary}`);

};

const updateSalary = async () => {
    const data = fs.readFileSync('salaries.json');
    const salaryData = JSON.parse(data);
    const employeeChoices = salaryData.map((employee, index) => ({
        name: `${employee.name} (Current salary: ${employee.salary})`,
        value: index,
    }));

    if (employeeChoices.length === 0) {
        console.log('No employees available to update.');
        return;
    }

    const answers = await prompt([
        {
            type: 'list',
            name: 'employeeIndex',
            message: 'Select an employee to update salary:',
            choices: employeeChoices,
        },
        {
            type: 'input',
            name: 'newSalary',
            message: 'Enter the new salary:',
            validate: (value) => {
                const valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number';
            },
            filter: Number,
        },
    ]);

    salaryData[answers.employeeIndex].salary = answers.newSalary;

    // Save updated data
    try {
        fs.writeFileSync('salaries.json', JSON.stringify(salaryData, null, 2));
        console.log('Salary data saved!');
    } catch (error) {
        console.error('Error writing JSON data:', error);
    }

    console.log(`Employee ${salaryData[answers.employeeIndex].name}'s salary updated to ${answers.newSalary}`);
};

const listEmployees = () => {
    try {
        const data = fs.readFileSync('salaries.json');
        const salaryData = JSON.parse(data);
        console.log('Employee Salary Data:', salaryData);
    } catch (err) {
        console.error('Error reading or parsing the file:', err);
    }
};


mainMenu();

