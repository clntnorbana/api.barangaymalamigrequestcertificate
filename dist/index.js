"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const resident_1 = __importDefault(require("./routes/resident"));
const employee_1 = __importDefault(require("./routes/employee"));
const certificate_1 = __importDefault(require("./routes/certificate"));
const record_1 = __importDefault(require("./routes/record"));
const archive_1 = __importDefault(require("./routes/archive"));
const app = (0, express_1.default)();
const corsOption = {
    origin: "https://barangaymalamigrequestcertificate.online",
    // origin: "http://localhost:5173",
    credentials: true,
};
// middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOption));
const port = process.env.PORT || 3000;
// test connection
(0, database_1.testConnection)();
// run server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// routes
app.use("/api/resident", resident_1.default);
app.use("/api/employee", employee_1.default);
app.use("/api/certificate", certificate_1.default);
app.use("/api/record", record_1.default);
app.use("/api/archive", archive_1.default);
