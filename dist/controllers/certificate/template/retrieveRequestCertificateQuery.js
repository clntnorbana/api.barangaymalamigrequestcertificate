"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveRequestCertificateById = exports.retrieveAllRequestCertificate = void 0;
const database_1 = require("../../../config/database");
const retrieveAllRequestCertificate = async () => {
    const [rows] = await database_1.pool.query(`SELECT * FROM request_certificate`);
    if (rows && rows.length > 0) {
        const requests = rows.map((row) => {
            return row;
        });
        return requests;
    }
    else {
        return [];
    }
};
exports.retrieveAllRequestCertificate = retrieveAllRequestCertificate;
// retrive request certificate by id
const retrieveRequestCertificateById = async (transaction_id) => {
    const [row] = await database_1.pool.query(`SELECT * FROM request_certificate WHERE transaction_id = ?`, [transaction_id]);
    if (row && row.length > 0) {
        const request = row[0];
        // get images
        const images = await getImages(transaction_id);
        // add images as property
        request.images = images ? images.map((image) => image.img_url) : [];
    }
    return row;
};
exports.retrieveRequestCertificateById = retrieveRequestCertificateById;
// get images provided
const getImages = async (transaction_id) => {
    const [rows] = await database_1.pool.query(`SELECT img_url FROM request_certificate_resident_images WHERE transaction_id = ?`, [transaction_id]);
    if (rows && rows.length > 0) {
        const images = rows.map((row) => {
            return row;
        });
        return images;
    }
    else {
        return [];
    }
};
