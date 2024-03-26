"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../config/database");
const getRecords = async (req, res) => {
    try {
        const [rows] = await database_1.pool.query(`SELECT * FROM request_certificate_record`);
        if (rows && rows.length > 0) {
            res.status(200).json(rows);
        }
        else {
            return [];
        }
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.default = getRecords;
