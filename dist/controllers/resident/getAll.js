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
const retrieveResidentQuery_1 = require("./template/retrieveResidentQuery");
const getResidents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const residents = yield (0, retrieveResidentQuery_1.retrieveAllResidents)();
        res.status(200).json(residents);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.default = getResidents;
