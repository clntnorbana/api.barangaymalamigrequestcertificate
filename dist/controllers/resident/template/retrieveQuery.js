"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveById = exports.retrieveAll = void 0;
const database_1 = require("../../../config/database");
const cloudinary_1 = require("../../../config/cloudinary");
// retrieve all residents
const retrieveAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield database_1.pool.query(`SELECT * FROM residents`);
    if (rows && rows.length > 0) {
        const residents = rows.map((row) => {
            return row;
        });
        return residents;
    }
    else {
        return [];
    }
});
exports.retrieveAll = retrieveAll;
// retrieve resident by id
const retrieveById = (profileId) => __awaiter(void 0, void 0, void 0, function* () {
    const [row] = yield database_1.pool.query(`SELECT * FROM residents WHERE profile_id = ?`, [profileId]);
    if (row && row.length > 0) {
        const resident = row[0];
        yield (0, cloudinary_1.getImagePathName)(row, resident.img_url);
        return row;
    }
    else {
        return null;
    }
});
exports.retrieveById = retrieveById;
