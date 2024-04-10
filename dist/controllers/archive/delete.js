"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllArchives = exports.deleteSingleArchive = void 0;
const database_1 = require("../../config/database");
const retrieveEmployeeQuery_1 = require("../employee/template/retrieveEmployeeQuery");
const encryptPassword_1 = require("../../utils/encryptPassword");
// delete single archive
const deleteSingleArchive = async (req, res) => {
    try {
        const transaction_id = req.params.transaction_id;
        await database_1.pool.query(`DELETE FROM archives WHERE transaction_id = ?`, [
            transaction_id,
        ]);
        res.status(200).json({ message: "Deleted successfully" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.deleteSingleArchive = deleteSingleArchive;
// delete all archives
const deleteAllArchives = async (req, res) => {
    try {
        const { employee_id, password } = req.body;
        const employee = await (0, retrieveEmployeeQuery_1.retriveEmployeeById)(employee_id);
        // check employee
        if (!employee) {
            return res.status(400).json({ message: "Employee do not exists" });
        }
        const info = employee[0];
        // check password input field
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        // password validation
        if (!(await (0, encryptPassword_1.comparePassword)(password, info.password))) {
            return res.status(400).json({ message: "Password is incorrect" });
        }
        await database_1.pool.query(`DELETE FROM archives`);
        res.status(200).json({ message: "Archive has been cleared" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.deleteAllArchives = deleteAllArchives;
