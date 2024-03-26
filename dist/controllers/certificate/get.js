"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestCertificate = exports.getRequestCertificates = void 0;
const retrieveRequestCertificateQuery_1 = require("./template/retrieveRequestCertificateQuery");
// get all
const getRequestCertificates = async (req, res) => {
    try {
        const requests = await (0, retrieveRequestCertificateQuery_1.retrieveAllRequestCertificate)();
        res.status(200).json(requests);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.getRequestCertificates = getRequestCertificates;
// get single
const getRequestCertificate = async (req, res) => {
    try {
        const transaction_id = req.params.transaction_id;
        const request = await (0, retrieveRequestCertificateQuery_1.retrieveRequestCertificateById)(transaction_id);
        res.status(200).json(request);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.getRequestCertificate = getRequestCertificate;
