import { Request, Response } from "express";
import { pool } from "../../config/database";
import { RowDataPacket } from "mysql2";
import {
  deleteImageFromCloudinary,
  extractPublicIdFromUrl,
} from "../../config/cloudinary";

const deleteRequest = async (req: Request, res: Response) => {
  try {
    const transaction_id: string = req.params.transaction_id;

    // delete images
    await deleteImages(transaction_id);

    pool.query(`DELETE FROM request_certificate WHERE transaction_id = ?`, [
      transaction_id,
    ]);

    res.status(200).json({ message: "Request certificate deleted" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// delete previous images
const deleteImages = async (transaction_id: string) => {
  const imgUrls = await getImages(transaction_id);

  if (imgUrls) {
    const publicIds = imgUrls.map((img) =>
      extractPublicIdFromUrl(img.img_url)
    ) as string[];

    for (const publicId of publicIds) {
      await deleteImageFromCloudinary(publicId);
    }
  }
};

// get images by transaction id
const getImages = async (transaction_id: string) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM request_certificate_resident_images WHERE transaction_id = ?`,
    [transaction_id]
  );

  if (rows && rows.length > 0) {
    return rows;
  } else {
    return [];
  }
};

export default deleteRequest;
