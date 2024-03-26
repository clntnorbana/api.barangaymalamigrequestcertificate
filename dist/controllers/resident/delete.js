"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deleteResidentImg_1 = __importDefault(require("./template/deleteResidentImg"));
const database_1 = require("../../config/database");
const retrieveEmployeeQuery_1 = require("../employee/template/retrieveEmployeeQuery");
const encryptPassword_1 = require("../../utils/encryptPassword");
const deleteResident = async (req, res) => {
    try {
        const { employee_id, password } = req.body;
        const profile_id = req.params.profile_id;
        // check id
        if (!profile_id) {
            return res.status(404).json({ message: "Resident do not exists" });
        }
        // check password input
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        const employee = await (0, retrieveEmployeeQuery_1.retriveEmployeeById)(employee_id);
        if (employee) {
            const info = employee[0];
            if (!(await (0, encryptPassword_1.comparePassword)(password, info.password))) {
                return res.status(400).json({ message: "Password is incorrect" });
            }
            // delete image
            await (0, deleteResidentImg_1.default)(profile_id);
            await database_1.pool.query(`DELETE FROM residents WHERE profile_id = ?`, [
                profile_id,
            ]);
            res.status(200).json({ message: "Resident deleted successfully" });
        }
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.default = deleteResident;
