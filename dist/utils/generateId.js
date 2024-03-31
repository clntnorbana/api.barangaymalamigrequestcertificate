"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// generate random string
const random = (len) => {
    let result = "";
    const chars = "QWERTYUIOPASDFGHJKLZXCVBNM0123456789";
    for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
// generate id
const generateId = (pfx) => {
    const currentYr = new Date().getFullYear();
    const randomStr = random(7);
    const id = `${pfx}${randomStr}${currentYr}`;
    return id;
};
exports.default = generateId;
