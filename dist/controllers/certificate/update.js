"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePurpose = exports.undoReject = exports.rejectRequest = exports.approveRequest = void 0;
const retrieveEmployeeQuery_1 = require("../employee/template/retrieveEmployeeQuery");
const database_1 = require("../../config/database");
const retrieveRequestCertificateQuery_1 = require("./template/retrieveRequestCertificateQuery");
const twilio_1 = __importDefault(require("../../config/twilio"));
const formatContactNo_1 = __importDefault(require("../../utils/formatContactNo"));
// approve request
const approveRequest = async (req, res) => {
    try {
        const transaction_id = req.params.transaction_id;
        const { employee_id } = req.body;
        const employee = await (0, retrieveEmployeeQuery_1.retriveEmployeeById)(employee_id);
        // set employee
        let commitedBy = "";
        if (employee) {
            const employeeInfo = employee[0];
            commitedBy = `${employeeInfo.firstname} ${employeeInfo.lastname}`;
        }
        //  update status
        const newStatus = "approved";
        await database_1.pool.query(`UPDATE request_certificate SET status = ? WHERE transaction_id = ?`, [newStatus, transaction_id]);
        // fetch request data to be save in records table
        const request = await (0, retrieveRequestCertificateQuery_1.retrieveRequestCertificateById)(transaction_id);
        if (request) {
            const requestInfo = request[0];
            await addToRecord(requestInfo.transaction_id, requestInfo.certificate_type, requestInfo.profile_id, requestInfo.request_by, requestInfo.contact_no, commitedBy, requestInfo.request_date);
            // format contact
            const formattedContactNo = (0, formatContactNo_1.default)(requestInfo.contact_no);
            // send sms
            (0, twilio_1.default)(`(${transaction_id}) Your request for obtaining certificate of ${requestInfo.certificate_type} has been approved, please download and print the profiling form from the website, and proceed to the barangay to retrieve the document`, formattedContactNo);
        }
        res.status(200).json({ message: "request approved" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.approveRequest = approveRequest;
// reject request
const rejectRequest = async (req, res) => {
    try {
        const transaction_id = req.params.transaction_id;
        const remark = req.body.remark;
        // update status
        const newStatus = "rejected";
        await database_1.pool.query(`UPDATE request_certificate SET status = ? WHERE transaction_id = ?`, [newStatus, transaction_id]);
        // fetch request data to be save in records table
        const request = await (0, retrieveRequestCertificateQuery_1.retrieveRequestCertificateById)(transaction_id);
        if (request) {
            const requestInfo = request[0];
            // format contact
            const formattedContactNo = (0, formatContactNo_1.default)(requestInfo.contact_no);
            // message
            const defaultMsg = `(${transaction_id}) Your request for obtaining certificate of ${requestInfo.certificate_type} has been rejected, due to inaccurate information provided.`;
            // send sms
            (0, twilio_1.default)(remark !== "" ? remark : defaultMsg, formattedContactNo);
        }
        res.status(200).json({ message: "request rejected" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.rejectRequest = rejectRequest;
// undo reject
const undoReject = async (req, res) => {
    try {
        const transaction_id = req.params.transaction_id;
        // set status
        const newStatus = "pending";
        await database_1.pool.query(`UPDATE request_certificate SET status = ? WHERE transaction_id = ?`, [newStatus, transaction_id]);
        res.status(200).json({ message: "undone" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.undoReject = undoReject;
// update purpose
const updatePurpose = async (req, res) => {
    try {
        const newPurpose = req.body.newPurpose;
        const transaction_id = req.params.transaction_id;
        // check input
        if (!newPurpose || newPurpose === "") {
            return res.status(400).json({ message: "Field is required" });
        }
        const request = await (0, retrieveRequestCertificateQuery_1.retrieveRequestCertificateById)(transaction_id);
        if (request) {
            const requestInfo = request[0];
            if (newPurpose === requestInfo.purpose) {
                return res.status(400).json({
                    message: "New purpose cannot be the same as the current one.",
                });
            }
        }
        // update purpose query
        await database_1.pool.query(`UPDATE request_certificate SET purpose = ? WHERE transaction_id = ?`, [newPurpose, transaction_id]);
        res.status(200).json({ message: "Purpose updated" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.updatePurpose = updatePurpose;
// add approve request to record table
const addToRecord = async (transaction_id, certificate_type, profile_id, request_by, contact_no, committed_by, request_date) => {
    await database_1.pool.query(`INSERT INTO request_certificate_record (transaction_id, certificate_type, profile_id, resident_name, resident_contact_no, committed_by, request_date) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
        transaction_id,
        certificate_type,
        profile_id,
        request_by,
        contact_no,
        committed_by,
        request_date,
    ]);
};
