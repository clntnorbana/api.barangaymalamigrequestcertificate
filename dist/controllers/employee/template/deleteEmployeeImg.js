"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("../../../config/cloudinary");
const retrieveEmployeeQuery_1 = require("./retrieveEmployeeQuery");
const deletePrevImage = async (employee_id) => {
    const employee = await (0, retrieveEmployeeQuery_1.retriveEmployeeById)(employee_id);
    if (employee && employee.length > 0) {
        const info = employee[0];
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
