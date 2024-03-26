"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retriveEmployeeById = exports.retrieveAllEmployees = void 0;
const database_1 = require("../../../config/database");
const cloudinary_1 = require("../../../config/cloudinary");
// retrieve all employees
const retrieveAllEmployees = async () => {
    const [rows] = await database_1.pool.query(`SELECT * FROM employees`);
    if (rows && rows.length > 0) {
        const employees = rows.map((row) => {
            return row;
        });
        await (0, cloudinary_1.getImagePathName)(employees);
        return employees;
    }
    else {
        return [];
    }
};
exports.retrieveAllEmployees = retrieveAllEmployees;
// retrieve employee by id
const retriveEmployeeById = async (employeeId) => {
    const [row] = await database_1.pool.query(`SELECT * FROM employees WHERE employee_id = ?`, [employeeId]);
    if (row && row.length > 0) {
        const employee = row[0];
        await (0, cloudinary_1.getImagePathName)(row, employee.img_url);
        return row;
    }
    else {
        return null;
    }
};
exports.retriveEmployeeById = retriveEmployeeById;
