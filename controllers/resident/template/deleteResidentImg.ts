import {
  deleteImageFromCloudinary,
  extractPublicIdFromUrl,
} from "../../../config/cloudinary";
import { TResident } from "../../../types";
import { retrieveResidentById } from "./retrieveResidentQuery";

// const delete previous image
const deletePrevImage = async (profileId: string) => {
  const resident = await retrieveResidentById(profileId);
  if (resident && resident.length > 0) {
    const info = resident[0] as TResident;

    const img = info.img_url;

    if (!img) {
      return;
    }

    const publicId = extractPublicIdFromUrl(img);

    if (publicId) {
      await deleteImageFromCloudinary(publicId);
    }
  }
};

export default deletePrevImage;
