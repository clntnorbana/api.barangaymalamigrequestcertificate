"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const create_1 = __importDefault(require("../controllers/archive/create"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const get_1 = __importDefault(require("../controllers/archive/get"));
const router = (0, express_1.Router)();
router.post("/move_to_archive", authMiddleware_1.requireAuth, create_1.default);
router.get("/get_archives", get_1.default);
exports.default = router;
