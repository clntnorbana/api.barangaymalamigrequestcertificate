"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../config/database");
const retrieveEmployeeQuery_1 = require("../employee/template/retrieveEmployeeQuery");
const encryptPassword_1 = require("../../utils/encryptPassword");
const moveToArchives = async (req, res) => {
    try {
        const { employee_id, password } = req.body;
        const employee = await (0, retrieveEmployeeQuery_1.retriveEmployeeById)(employee_id);
        if (!employee) {
            return res.status(400).json({ message: "Employee not found" });
        }
        const info = employee[0];
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        if (!(await (0, encryptPassword_1.comparePassword)(password, info.password))) {
            return res.status(400).json({ message: "Password is incorrect" });
        }
        const conn = await database_1.pool.getConnection();
        try {
            await conn.beginTransaction();
            // Move data to archives
            const moveQuery = `
        INSERT INTO archives (transaction_id, profile_id, request_by, certificate_type, purpose, contact_no, email, status, request_date)
        SELECT transaction_id, profile_id, request_by, certificate_type, purpose, contact_no, email, status, request_date
        FROM request_certificate WHERE status IN ('approved', 'rejected')
      `;
            await conn.query(moveQuery);
            // Delete data from request_certificate
            await conn.query("DELETE FROM request_certificate WHERE status IN ('approved', 'rejected')");
            await conn.commit();
            conn.release();
            return res
                .status(200)
                .json({ message: "Data moved to archives successfully" });
        }
        catch (error) {
            await conn.rollback();
            conn.release();
            console.error("Error moving data to archives:", error);
            return res
                .status(500)
                .json({ message: "An error occurred while moving data to archives" });
        }
    }
    catch (error) {
        console.error("Error in moveToArchives function:", error);
        return res
            .status(500)
            .json({ message: "An internal server error occurred" });
    }
};
exports.default = moveToArchives;
