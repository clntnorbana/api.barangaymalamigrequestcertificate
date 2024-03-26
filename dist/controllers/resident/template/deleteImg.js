"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("../../../config/cloudinary");
const retrieveResidentQuery_1 = require("./retrieveResidentQuery");
// const delete previous image
const deletePrevImage = (profileId) => __awaiter(void 0, void 0, void 0, function* () {
    const resident = yield (0, retrieveResidentQuery_1.retrieveResidentById)(profileId);
    if (resident && resident.length > 0) {
        const info = resident[0];
        const img = info.img_url;
        if (!img) {
            return;
        }
        const publicId = (0, cloudinary_1.extractPublicIdFromUrl)(img);
        if (publicId) {
            yield (0, cloudinary_1.deleteImageFromCloudinary)(publicId);
        }
    }
});
exports.default = deletePrevImage;
