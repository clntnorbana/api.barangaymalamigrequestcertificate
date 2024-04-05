"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateRandomStr = (length) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let randomString = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset[randomIndex];
    }
    return randomString;
};
const hasRequiredChars = (str) => {
    const hasLowercase = /[a-z]/.test(str);
    const hasUppercase = /[A-Z]/.test(str);
    const hasSymbol = /[\W_]/.test(str);
    const hasNumber = /[0-9]/.test(str);
    return hasLowercase && hasUppercase && hasSymbol && hasNumber;
};
const generatedPassword = (length) => {
    let generatedString = generateRandomStr(length);
    while (!hasRequiredChars(generatedString)) {
        generatedString = generateRandomStr(length);
    }
    return generatedString;
};
exports.default = generatedPassword;
