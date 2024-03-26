"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const get_1 = __importDefault(require("../controllers/record/get"));
const delete_1 = require("../controllers/record/delete");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get("/get_records", get_1.default);
router.delete("/delete_records", authMiddleware_1.requireAuth, delete_1.deleteAll);
router.delete("/delete_record/:transaction_id", delete_1.deleteRecord);
exports.default = router;
