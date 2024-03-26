"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const requireAuth = async (req, res, next) => {
    let token;
    token = req.cookies.jwt;
    if (!token) {
        return res.status(400).json({
            message: "unauthorized",
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userData = await database_1.pool.query(`SELECT * FROM employees WHERE id = ?`, [
            decoded.userId,
        ]);
        next();
    }
    catch (error) {
        console.error("Unexpected error", error);
    }
};
exports.requireAuth = requireAuth;
