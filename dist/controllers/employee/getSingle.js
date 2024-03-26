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
const retrieveEmployeeQuery_1 = require("./template/retrieveEmployeeQuery");
const getEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee_id = req.params.employee_id;
        const employee = yield (0, retrieveEmployeeQuery_1.retriveEmployeeById)(employee_id);
        return res.status(200).json(employee);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.default = getEmployee;
