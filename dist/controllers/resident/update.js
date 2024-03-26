"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const retrieveResidentQuery_1 = require("./template/retrieveResidentQuery");
const cloudinary_1 = require("../../config/cloudinary");
const database_1 = require("../../config/database");
const deleteResidentImg_1 = __importDefault(require("./template/deleteResidentImg"));
const updateResident = async (req, res) => {
    try {
        const { firstname, lastname, middlename, sex, date_of_birth, place_of_birth, contact_no, email, citizenship, religion, civil_status, company, occupation, number_street, voter, } = req.body;
        const profile_id = req.params.profile_id;
        if (!firstname ||
            !lastname ||
            !sex ||
            !date_of_birth ||
            !contact_no ||
            !citizenship ||
            !voter ||
            !number_street ||
            !civil_status) {
            return res.status(400).json({ message: "Fill all required fields" });
        }
        // check email
        if (email && !validator_1.default.isEmail(email)) {
            return res.status(400).json({ message: "Email is invalid" });
        }
        // check contact_no
        if (contact_no && contact_no.length !== 11) {
            return res.status(400).json({ message: "Invalid phone number" });
        }
        // data already exists?
        const residents = await (0, retrieveResidentQuery_1.retrieveAllResidents)();
        if (residents) {
            for (const resident of residents) {
                if (resident.profile_id !== profile_id) {
                    // contact_no exists?
                    if (resident.contact_no === contact_no) {
                        return res
                            .status(400)
                            .json({ message: "Phone number already exists" });
                    }
                    // email exists?
                    if (resident.email === email) {
                        return res.status(400).json({ message: "Email is already used" });
                    }
                }
            }
        }
        // upload image
        let imgUrl = "";
        if (req.file) {
            // delete prev image
            await (0, deleteResidentImg_1.default)(profile_id);
            // upload new image
            const result = await (0, cloudinary_1.uploadResult)(req.file.path, "residents");
            imgUrl = result.public_id;
        }
        else {
            const resident = await (0, retrieveResidentQuery_1.retrieveResidentById)(profile_id);
            if (resident && resident.length > 0) {
                const info = resident[0];
                if (info.img_url) {
                    imgUrl = (0, cloudinary_1.extractPublicIdFromUrl)(info.img_url);
                }
            }
        }
        // update query
        await database_1.pool.query(`UPDATE residents SET img_url = ?, firstname = ?, lastname = ?, middlename = ?, sex = ?, date_of_birth = ?, place_of_birth = ?, contact_no = ?, email = ?, citizenship = ?, religion = ?, civil_status = ?, company = ?, occupation = ?, number_street = ?, voter = ? WHERE profile_id = ?`, [
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
            voter,
            profile_id,
        ]);
        res
            .status(200)
            .json({ message: "Resident's information updated successfully" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.default = updateResident;
