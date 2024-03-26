"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.pool = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const pool = mysql2_1.default
    .createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
})
    .promise();
exports.pool = pool;
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to database");
        connection.release();
    }
    catch (error) {
        console.error(`Failed to connect to database`, error.code, error.message);
    }
};
exports.testConnection = testConnection;
