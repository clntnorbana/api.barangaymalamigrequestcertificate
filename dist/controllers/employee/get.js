"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployee = exports.getEmployees = void 0;
const retrieveEmployeeQuery_1 = require("./template/retrieveEmployeeQuery");
const retrieveEmployeeQuery_2 = require("./template/retrieveEmployeeQuery");
// get all
const getEmployees = async (req, res) => {
  try {
    const employees = await (0, retrieveEmployeeQuery_1.retrieveAllEmployees)();
    res.status(200).json(employees);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.getEmployees = getEmployees;
// get single
const getEmployee = async (req, res) => {
  try {
    const employee_id = req.params.employee_id;
    const employee = await (0, retrieveEmployeeQuery_2.retriveEmployeeById)(
      employee_id
    );
    return res.status(200).json(employee);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.getEmployee = getEmployee;
