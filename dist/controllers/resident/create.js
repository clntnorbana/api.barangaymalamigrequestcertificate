"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const retrieveResidentQuery_1 = require("./template/retrieveResidentQuery");
const cloudinary_1 = require("../../config/cloudinary");
const generateId_1 = __importDefault(require("../../utils/generateId"));
const database_1 = require("../../config/database");
const createResident = async (req, res) => {
    try {
        const { firstname, lastname, middlename, sex, date_of_birth, place_of_birth, contact_no, email, citizenship, religion, civil_status, company, occupation, number_street, voter, } = req.body;
        // check inputs
        if (!firstname ||
            !lastname ||
            !sex ||
            !date_of_birth ||
            !place_of_birth ||
            !contact_no ||
            !citizenship ||
            !civil_status ||
            !number_street ||
            !voter) {
            return res.status(400).json({ message: "Fill the required fields" });
        }
        // check email
        if (email && !validator_1.default.isEmail(email)) {
            return res.status(400).json({ message: "Email is invalid" });
        }
        // data already exists
        const residents = await (0, retrieveResidentQuery_1.retrieveAllResidents)();
        if (residents) {
            for (const resident of residents) {
                // contact_no exists
                if (resident.contact_no === contact_no) {
                    return res
                        .status(400)
                        .json({ message: "STEP 2: Phone number is already used" });
                }
                // email exists
                if (email && resident.email === email) {
                    return res
                        .status(400)
                        .json({ message: "STEP 2: Email is already used" });
                }
            }
        }
        // upload image
        let imgUrl = "";
        if (req.file) {
            const result = await (0, cloudinary_1.uploadResult)(req.file.path, "residents");
            imgUrl = result.public_id;
        }
        // generate id
        const profileId = (0, generateId_1.default)("P");
        // insert to db
        await database_1.pool.query(`INSERT INTO residents (profile_id, img_url, firstname, lastname, middlename, sex, date_of_birth, place_of_birth, contact_no, email, citizenship, religion, civil_status, company, occupation, number_street, barangay, city, zip_code, voter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            profileId,
            imgUrl,
            firstname,
            lastname,
            middlename,
            sex,
            date_of_birth,
            place_of_birth,
            contact_no,
            email,
            citizenship,
            religion,
            civil_status,
            company,
            occupation,
            number_street,
            "malamig",
            "mandaluyong city",
            "1550",
            voter,
        ]);
        res.status(200).json({
            message: "Your information has been recorded, please copy and keep your profile ID, before returning to homepage.",
            profileId: profileId,
        });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.default = createResident;
