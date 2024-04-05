"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../config/database");
const formatContactNo_1 = __importDefault(require("../../utils/formatContactNo"));
const twilio_1 = __importDefault(require("../../config/twilio"));
const getProfileForgottenProfileId = async (req, res) => {
    try {
        const { contact_no } = req.body;
        if (!contact_no) {
            return res.status(400).json({ message: "Please type your phone number" });
        }
        const [row] = await database_1.pool.query(`SELECT profile_id, firstname, lastname, contact_no FROM residents WHERE contact_no = ?`, [contact_no]);
        if (!row[0]) {
            return res.status(404).json({
                message: "The phone number you provided does not exist in the database. Please try again.",
            });
        }
        const formattedContactNo = (0, formatContactNo_1.default)(contact_no);
        const message = `${row[0].firstname} ${row[0].lastname}, your profile id is (${row[0].profile_id})`;
        if (formattedContactNo) {
            (0, twilio_1.default)(message, formattedContactNo);
        }
        res.status(200).json({
            message: `Your profile ID has been sent to your phone number (${formattedContactNo})`,
        });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.default = getProfileForgottenProfileId;
