"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployee = exports.deleteAccount = void 0;
const retrieveEmployeeQuery_1 = require("./template/retrieveEmployeeQuery");
const encryptPassword_1 = require("../../utils/encryptPassword");
const deleteEmployeeImg_1 = __importDefault(require("./template/deleteEmployeeImg"));
const database_1 = require("../../config/database");
// delete account
const deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;
        const employee_id = req.params.employee_id;
        const employee = await (0, retrieveEmployeeQuery_1.retriveEmployeeById)(employee_id);
        if (employee) {
            const info = employee[0];
            if (!(await (0, encryptPassword_1.comparePassword)(password, info.password))) {
                return res.status(400).json({ message: "Invalid password" });
            }
            // delete prev image
            if (info.img_url !== null) {
                await (0, deleteEmployeeImg_1.default)(info.employee_id);
            }
        }
        // delete query
        await database_1.pool.query(`DELETE FROM employees WHERE employee_id = ?`, [
            employee_id,
        ]);
        res.status(200).json({ message: "Account deleted" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.deleteAccount = deleteAccount;
// delete employee
const deleteEmployee = async (req, res) => {
    try {
        const employee_id = req.params.employee_id;
        // check id
        if (!employee_id) {
            return res.status(400).json({ message: "Employee do not exists" });
        }
        const employee = await (0, retrieveEmployeeQuery_1.retriveEmployeeById)(employee_id);
        if (employee) {
            const info = employee[0];
            // delete prev image
            if (info.img_url !== null) {
                await (0, deleteEmployeeImg_1.default)(info.employee_id);
            }
        }
        await database_1.pool.query(`DELETE FROM employees WHERE employee_id = ?`, [
            employee_id,
        ]);
        res.status(200).json({ message: "Account deleted" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.deleteEmployee = deleteEmployee;
