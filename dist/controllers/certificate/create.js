"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateId_1 = __importDefault(require("../../utils/generateId"));
const retrieveResidentQuery_1 = require("../resident/template/retrieveResidentQuery");
const cloudinary_1 = require("../../config/cloudinary");
const database_1 = require("../../config/database");
const createRequest = async (req, res) => {
    try {
        const { profile_id, certificate_type, purpose } = req.body;
        let fullName = "";
        let contact_no = "";
        let email = "";
        const transaction_id = (0, generateId_1.default)("crt");
        const resident = await (0, retrieveResidentQuery_1.retrieveResidentById)(profile_id);
        if (resident) {
            const info = resident[0];
            // set full name
            fullName = `${info.firstname} ${info.middlename && info.middlename} ${info.lastname}`;
            // set contact_no
            contact_no = info.contact_no;
            // set contact email
            email = info.email ? info.email : null;
        }
        // set image
        let img_urls = [];
        if (Array.isArray(req.files) && req.files.length > 0) {
            for (const file of req.files) {
                const result = await (0, cloudinary_1.uploadResult)(file.path, "request_certificate_images");
                img_urls.push(result.secure_url);
            }
        }
        // insert to db
        await database_1.pool.query(`INSERT INTO request_certificate (transaction_id, profile_id, request_by, certificate_type, purpose, contact_no, email, status) VALUES (?,?,?,?,?,?,?,?)`, [
            transaction_id,
            profile_id,
            fullName,
            certificate_type,
            purpose,
            contact_no,
            email,
            "pending",
        ]);
        // insert images to db
        if (img_urls.length > 0) {
            const insertValues = img_urls.map((url) => [transaction_id, url]);
            await database_1.pool.query(`INSERT INTO request_certificate_resident_images (transaction_id, img_url) VALUES ?`, [insertValues]);
        }
        res.status(200).json({
            message: "Your request has been recorded, please copy and keep your transaction id before going.",
            transaction_id: transaction_id,
        });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.default = createRequest;
