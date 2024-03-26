"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveResidentById = exports.retrieveAllResidents = void 0;
const database_1 = require("../../../config/database");
const cloudinary_1 = require("../../../config/cloudinary");
// retrieve all residents
const retrieveAllResidents = async () => {
    const [rows] = await database_1.pool.query(`SELECT * FROM residents`);
    if (rows && rows.length > 0) {
        const residents = rows.map((row) => {
            return row;
        });
        return residents;
    }
    else {
        return [];
    }
};
exports.retrieveAllResidents = retrieveAllResidents;
// retrieve resident by id
const retrieveResidentById = async (profileId) => {
    const [row] = await database_1.pool.query(`SELECT * FROM residents WHERE profile_id = ?`, [profileId]);
    if (row && row.length > 0) {
        const resident = row[0];
        await (0, cloudinary_1.getImagePathName)(row, resident.img_url);
        return row;
    }
    else {
        return null;
    }
};
exports.retrieveResidentById = retrieveResidentById;
