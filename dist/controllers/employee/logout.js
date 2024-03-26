"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logoutEmployee = async (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({ message: "logout" });
};
exports.default = logoutEmployee;
