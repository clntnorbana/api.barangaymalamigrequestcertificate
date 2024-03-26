"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const retrieveEmployeeQuery_1 = require("./template/retrieveEmployeeQuery");
const validator_1 = __importDefault(require("validator"));
const generateId_1 = __importDefault(require("../../utils/generateId"));
const encryptPassword_1 = require("../../utils/encryptPassword");
const database_1 = require("../../config/database");
const createEmployee = async (req, res) => {
    try {
        const { username, password, admin_role, firstname, lastname, email, contact_no, } = req.body;
        // check inputs
        if (!username || !password || !admin_role) {
            return res
                .status(400)
                .json({ message: "Please fill the required fields" });
        }
        // data already exists?
        const employees = await (0, retrieveEmployeeQuery_1.retrieveAllEmployees)();
        if (employees) {
            for (const employee of employees) {
                // username exists?
                if (employee.username === username) {
                    return res.status(400).json({ message: "username is already used" });
                }
                // contact_no exists?
                if (contact_no && employee.contact_no === contact_no) {
                    return res
                        .status(400)
                        .json({ message: "phone number is already used" });
                }
                // email exists?
                if (email && employee.email === email) {
                    return res.status(400).json({ message: "email is already used" });
                }
            }
        }
        // check password strength
        if (!validator_1.default.isStrongPassword(password)) {
            return res.status(400).json({ message: "Password is not strong enough" });
        }
        // check email if valid
        if (email && !validator_1.default.isEmail(email)) {
            return res.status(400).json({ message: "Email is invalid" });
        }
        // check contact number length
        if (contact_no && contact_no.length !== 11) {
            return res.status(400).json({ message: "Phone number is invalid" });
        }
        const employeeId = (0, generateId_1.default)("EMP");
        const status = "away";
        const defaultContact = contact_no ? contact_no : null;
        const defaultEmail = email ? email : null;
        const defaultFirstname = firstname ? firstname : null;
        const defaultLastname = lastname ? lastname : null;
        const hashedPassword = await (0, encryptPassword_1.hashPassword)(password);
        await database_1.pool.query(`INSERT INTO employees (employee_id, admin_role, username, password, firstname, lastname, email, contact_no, status) VALUES (?,?,?,?,?,?,?,?, ?)`, [
            employeeId,
            admin_role,
            username,
            hashedPassword,
            defaultFirstname,
            defaultLastname,
            defaultEmail,
            defaultContact,
            status,
        ]);
        res.status(200).json({ message: "New account successfully created." });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.default = createEmployee;
