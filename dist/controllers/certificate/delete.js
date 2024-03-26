"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../config/database");
const cloudinary_1 = require("../../config/cloudinary");
const deleteRequest = async (req, res) => {
    try {
        const transaction_id = req.params.transaction_id;
        // delete images
        await deleteImages(transaction_id);
        database_1.pool.query(`DELETE FROM request_certificate WHERE transaction_id = ?`, [
            transaction_id,
        ]);
        res.status(200).json({ message: "Request certificate deleted" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
// delete previous images
const deleteImages = async (transaction_id) => {
    const imgUrls = await getImages(transaction_id);
    if (imgUrls) {
        const publicIds = imgUrls.map((img) => (0, cloudinary_1.extractPublicIdFromUrl)(img.img_url));
        for (const publicId of publicIds) {
            await (0, cloudinary_1.deleteImageFromCloudinary)(publicId);
        }
    }
};
// get images by transaction id
const getImages = async (transaction_id) => {
    const [rows] = await database_1.pool.query(`SELECT * FROM request_certificate_resident_images WHERE transaction_id = ?`, [transaction_id]);
    if (rows && rows.length > 0) {
        return rows;
    }
    else {
        return [];
    }
};
exports.default = deleteRequest;
