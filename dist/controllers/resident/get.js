"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResident = exports.getResidents = void 0;
const retrieveResidentQuery_1 = require("./template/retrieveResidentQuery");
// get all
const getResidents = async (req, res) => {
    try {
        const residents = await (0, retrieveResidentQuery_1.retrieveAllResidents)();
        res.status(200).json(residents);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.getResidents = getResidents;
// get single
const getResident = async (req, res) => {
    try {
        const profile_id = req.params.profile_id;
        const resident = await (0, retrieveResidentQuery_1.retrieveResidentById)(profile_id);
        return res.status(200).json(resident);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.getResident = getResident;
