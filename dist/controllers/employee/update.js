"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSetting = exports.changeForgottenPassword = exports.updateAdminRole = exports.updatePassword = exports.updateEmployee = void 0;
const validator_1 = __importDefault(require("validator"));
const retrieveEmployeeQuery_1 = require("./template/retrieveEmployeeQuery");
const encryptPassword_1 = require("../../utils/encryptPassword");
const deleteEmployeeImg_1 = __importDefault(require("./template/deleteEmployeeImg"));
const cloudinary_1 = require("../../config/cloudinary");
const database_1 = require("../../config/database");
const formatContactNo_1 = __importDefault(require("../../utils/formatContactNo"));
const generatePassword_1 = __importDefault(require("../../utils/generatePassword"));
const twilio_1 = __importDefault(require("../../config/twilio"));
// update information
const updateEmployee = async (req, res) => {
    try {
        const { username, password, firstname, lastname, middlename, contact_no, email, } = req.body;
        const employee_id = req.params.employee_id;
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        if (!username) {
            return res.status(400).json({ message: "Username cannot be empty" });
        }
        if (!firstname || !lastname) {
            return res
                .status(400)
                .json({ message: "First name or last name cannot be empty" });
        }
        if (!contact_no) {
            return res.status(400).json({ message: "Phone number cannot be empty" });
        }
        if (contact_no.length !== 11) {
            return res.status(400).json({ message: "Invalid phone number" });
        }
        if (!validator_1.default.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }
        // data already exists?
        const employees = await (0, retrieveEmployeeQuery_1.retrieveAllEmployees)();
        if (employees) {
            for (const employee of employees) {
                if (employee.employee_id !== employee_id) {
                    // username exists
                    if (employee.username === username) {
                        return res
                            .status(400)
                            .json({ message: "Username is already used" });
                    }
                    // contact_ exists
                    if (employee.contact_no === contact_no) {
                        return res
                            .status(400)
                            .json({ message: "Phone number is already used" });
                    }
                    // email exists
                    if (employee.email === email) {
                        return res
                            .status(400)
                            .json({ message: "Email address is already used" });
                    }
                }
                // compare password
                if (employee.employee_id === employee_id) {
                    if (!(await (0, encryptPassword_1.comparePassword)(password, employee.password))) {
                        return res
                            .status(400)
                            .json({ message: "Invalid password, try again." });
                    }
                }
            }
        }
        // image upload
        let imgUrl = "";
        if (req.file) {
            // delete prev image
            await (0, deleteEmployeeImg_1.default)(employee_id);
            // upload new image
            const result = await (0, cloudinary_1.uploadResult)(req.file.path, "employees");
            imgUrl = result.public_id;
        }
        else {
            const employee = await (0, retrieveEmployeeQuery_1.retriveEmployeeById)(employee_id);
            if (employee && employee.length > 0) {
                const info = employee[0];
                if (info.img_url) {
                    imgUrl = (0, cloudinary_1.extractPublicIdFromUrl)(info.img_url);
                }
            }
        }
        // update query
        await database_1.pool.query(`UPDATE employees SET img_url = ?, username = ?, firstname = ?, middlename = ?, lastname = ?, email = ?, contact_no = ? WHERE employee_id = ?`, [
            imgUrl,
            username,
            firstname,
            middlename,
            lastname,
            email,
            contact_no,
            employee_id,
        ]);
        res
            .status(200)
            .json({ message: "Your information is successfully updated" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.updateEmployee = updateEmployee;
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const employee_id = req.params.employee_id;
        // check input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Field is required" });
        }
        // check password strength
        if (!validator_1.default.isStrongPassword(newPassword)) {
            return res.status(400).json({ message: "Password is not strong enough" });
        }
        // check password validation
        const employee = await (0, retrieveEmployeeQuery_1.retriveEmployeeById)(employee_id);
        if (employee) {
            const info = employee[0];
            if (!(await (0, encryptPassword_1.comparePassword)(currentPassword, info.password))) {
                return res.status(400).json({ message: "Invalid current password" });
            }
        }
        // current password same as new one
        if (currentPassword === newPassword) {
            return res.status(400).json({
                message: "New password cannot be the same as the current one",
            });
        }
        // encrypt password
        const hashedPassword = await (0, encryptPassword_1.hashPassword)(newPassword);
        await database_1.pool.query(`UPDATE employees SET password = ? WHERE employee_id = ?`, [hashedPassword, employee_id]);
        return res
            .status(200)
            .json({ message: "Password is updated successfully" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.updatePassword = updatePassword;
// update admin role
const updateAdminRole = async (req, res) => {
    try {
        const employee_id = req.params.employee_id;
        const employee = await (0, retrieveEmployeeQuery_1.retriveEmployeeById)(employee_id);
        let newAdminRole = "";
        if (employee) {
            const info = employee[0];
            newAdminRole = info.admin_role === "editor" ? "normal" : "editor";
        }
        // update query
        database_1.pool.query(`UPDATE employees SET admin_role = ? WHERE employee_id = ?`, [
            newAdminRole,
            employee_id,
        ]);
        res.status(200).json({ message: `Admin role changed to ${newAdminRole}` });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.updateAdminRole = updateAdminRole;
// change password
const changeForgottenPassword = async (req, res) => {
    try {
        const { employee_id, contact_no } = req.body;
        // check inputs
        if (!employee_id || !contact_no) {
            return res.status(400).json({ message: "Field is required" });
        }
        const employee = await (0, retrieveEmployeeQuery_1.retriveEmployeeById)(employee_id);
        if (!employee || employee.length === 0) {
            return res.status(400).json({ message: "Employee id do not exists" });
        }
        const info = employee[0];
        // check phone number
        if (contact_no !== info.contact_no) {
            return res.status(400).json({ message: "Phone number do not exists" });
        }
        const newPassword = (0, generatePassword_1.default)(8);
        const hashedPassword = await (0, encryptPassword_1.hashPassword)(newPassword);
        const formattedContactNo = (0, formatContactNo_1.default)(info.contact_no);
        await database_1.pool.query(`UPDATE employees SET password = ? WHERE employee_id = ?`, [hashedPassword, employee_id]);
        if (formattedContactNo) {
            (0, twilio_1.default)(`${info.firstname} ${info.lastname} (${employee_id}), your temporary password is: ${newPassword}`, formattedContactNo);
        }
        res.status(200).json({
            message: `Your temporary password has been sent to your phone (${info.contact_no})`,
        });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.changeForgottenPassword = changeForgottenPassword;
// update setting
const updateSetting = async (req, res) => {
    try {
        const { contact, schedule } = req.body;
        if (!contact || !schedule) {
            return res.status(400).json({ message: "Field is required" });
        }
        await database_1.pool.query(`UPDATE setting SET contact = ?, schedule = ? WHERE id = ?`, [contact, schedule, "1"]);
        res.status(200).json({ message: "Updated successfully" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.updateSetting = updateSetting;
