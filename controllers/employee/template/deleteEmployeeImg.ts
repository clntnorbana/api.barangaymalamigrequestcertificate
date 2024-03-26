import {
  deleteImageFromCloudinary,
  extractPublicIdFromUrl,
} from "../../../config/cloudinary";
import { TEmployee } from "../../../types";
import { retriveEmployeeById } from "./retrieveEmployeeQuery";

const deletePrevImage = async (employee_id: string) => {
  const employee = await retriveEmployeeById(employee_id);
  if (employee && employee.length > 0) {
    const info = employee[0] as TEmployee;

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
