"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = __importDefault(require("twilio"));
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_TOKEN;
const client = (0, twilio_1.default)(accountSid, authToken);
const sendSMS = async (message, contact_no) => {
    let messageOption = {
        from: process.env.TWILIO_PHONE_NUMBER,
        to: contact_no,
        body: message,
    };
    try {
        await client.messages.create(messageOption);
    }
    catch (error) {
        console.log(error.message);
    }
};
exports.default = sendSMS;
