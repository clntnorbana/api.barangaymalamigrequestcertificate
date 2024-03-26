"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecord = exports.deleteAll = void 0;
const database_1 = require("../../config/database");
const retrieveEmployeeQuery_1 = require("../employee/template/retrieveEmployeeQuery");
const encryptPassword_1 = require("../../utils/encryptPassword");
// delete all
const deleteAll = async (req, res) => {
    try {
        const { password, employee_id } = req.body;
        // check password
        if (!password) {
            return res.status(400).json({ message: "Field is required" });
        }
        const employee = await (0, retrieveEmployeeQuery_1.retriveEmployeeById)(employee_id);
        let employeePassword = "";
        if (employee) {
            const employeeInfo = employee[0];
            if (employeeInfo) {
                employeePassword = employeeInfo.password;
            }
        }
        // password validation
        if (!(await (0, encryptPassword_1.comparePassword)(password, employeePassword))) {
            return res.status(400).json({ message: "Invalid password, try again" });
        }
        // delete query
        await database_1.pool.query(`DELETE FROM request_certificate_record`);
        res.status(200).json({ message: "Records deleted successfully" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.deleteAll = deleteAll;
// delete single
const deleteRecord = async (req, res) => {
    try {
        const transaction_id = req.params.transaction_id;
        if (!transaction_id) {
            return res.status(404).json({ message: "Transaction do not found" });
        }
        await database_1.pool.query(`DELETE FROM request_certificate_record WHERE transaction_id = ?`, [transaction_id]);
        res.status(200).json({ message: "Deleted successfully" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.deleteRecord = deleteRecord;
