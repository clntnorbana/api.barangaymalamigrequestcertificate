import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// image upload
const uploadResult = async (pathName: string, folderName: string) => {
  const result = await cloudinary.uploader.upload(pathName, {
    folder: folderName,
  });

  return result;
};

// get image path name
const getImagePathName = async (rows: any, pathName: string | null = null) => {
  for (const row of rows) {
    const imgLink = pathName || row.img_url;
    if (imgLink) {
      const imgInfo = await cloudinary.api.resource(imgLink);
      if (imgInfo.secure_url) {
        row.img_url = imgInfo.secure_url;
      }
    }
  }

  return rows;
};

// extract image
const extractPublicIdFromUrl = (imgUrl: string) => {
  if (typeof imgUrl === "string") {
    const regex =
      /\/upload\/v\d+\/((employees|residents|request_certificate_images)\/[^/.]+)/;
    const match = imgUrl.match(regex);

    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

// delete image
const deleteImageFromCloudinary = async (publicId: string) => {
  if (publicId) {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  }
};

export {
  cloudinary,
  uploadResult,
  getImagePathName,
  deleteImageFromCloudinary,
  extractPublicIdFromUrl,
};
