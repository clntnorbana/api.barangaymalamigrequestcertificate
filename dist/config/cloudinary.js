"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPublicIdFromUrl = exports.deleteImageFromCloudinary = exports.getImagePathName = exports.uploadResult = exports.cloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// image upload
const uploadResult = async (pathName, folderName) => {
    const result = await cloudinary_1.v2.uploader.upload(pathName, {
        folder: folderName,
    });
    return result;
};
exports.uploadResult = uploadResult;
// get image path name
const getImagePathName = async (rows, pathName = null) => {
    for (const row of rows) {
        const imgLink = pathName || row.img_url;
        if (imgLink) {
            const imgInfo = await cloudinary_1.v2.api.resource(imgLink);
            if (imgInfo.secure_url) {
                row.img_url = imgInfo.secure_url;
            }
        }
    }
    return rows;
};
exports.getImagePathName = getImagePathName;
// extract image
const extractPublicIdFromUrl = (imgUrl) => {
    if (typeof imgUrl === "string") {
        const regex = /\/upload\/v\d+\/((employees|residents|request_certificate_images)\/[^/.]+)/;
        const match = imgUrl.match(regex);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
};
exports.extractPublicIdFromUrl = extractPublicIdFromUrl;
// delete image
const deleteImageFromCloudinary = async (publicId) => {
    if (publicId) {
        const result = await cloudinary_1.v2.uploader.destroy(publicId);
        return result;
    }
};
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
