"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../config/database");
const encryptPassword_1 = require("../../utils/encryptPassword");
const generateToken_1 = __importDefault(require("../../utils/generateToken"));
const loginEmployee = async (req, res) => {
    try {
        const { username, password } = req.body;
        // check input
        if (!username || !password) {
            return res.status(400).json({ message: "Field is required" });
        }
        // get credential
        const credential = await getCredential(username);
        const employee = credential[0];
        // check credential
        if (!employee ||
            !employee.username ||
            !(await (0, encryptPassword_1.comparePassword)(password, employee.password))) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        // success logged in
        (0, generateToken_1.default)(res, employee.id);
        res.status(200).json({
            username: employee.username,
            employee_id: employee.employee_id,
        });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
// get credential by username
const getCredential = async (username) => {
    const [credential] = await database_1.pool.query(`SELECT username, password, employee_id FROM employees WHERE username = ?`, [username]);
    return credential;
};
exports.default = loginEmployee;
