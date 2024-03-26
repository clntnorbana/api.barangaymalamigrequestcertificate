"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("../../../config/cloudinary");
const retrieveResidentQuery_1 = require("./retrieveResidentQuery");
// const delete previous image
const deletePrevImage = async (profileId) => {
    const resident = await (0, retrieveResidentQuery_1.retrieveResidentById)(profileId);
    if (resident && resident.length > 0) {
        const info = resident[0];
        const img = info.img_url;
        if (!img) {
            return;
        }
        const publicId = (0, cloudinary_1.extractPublicIdFromUrl)(img);
        if (publicId) {
            await (0, cloudinary_1.deleteImageFromCloudinary)(publicId);
        }
    }
};
exports.default = deletePrevImage;
