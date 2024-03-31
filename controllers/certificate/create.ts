import { Request, Response } from "express";
import { TRequestCertificate, TResident } from "../../types";
import generateId from "../../utils/generateId";
import { retrieveResidentById } from "../resident/template/retrieveResidentQuery";
import { uploadResult } from "../../config/cloudinary";
import { pool } from "../../config/database";

const createRequest = async (req: Request, res: Response) => {
  try {
    const { profile_id, certificate_type, purpose }: TRequestCertificate =
      req.body;

    let fullName: string = "";
    let contact_no: string = "";
    let email: string | null = "";
    const transaction_id = generateId("C");

    const resident = await retrieveResidentById(profile_id);
    if (resident) {
      const info = resident[0] as TResident;
      // set full name
      fullName = `${info.firstname} ${info.middlename && info.middlename} ${
        info.lastname
      }`;

      // set contact_no
      contact_no = info.contact_no;

      // set contact email
      email = info.email ? info.email : null;
    }

    // set image
    let img_urls = [];
    if (Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadResult(
          file.path,
          "request_certificate_images"
        );

        img_urls.push(result.secure_url);
      }
    }

    // insert to db
    await pool.query(
      `INSERT INTO request_certificate (transaction_id, profile_id, request_by, certificate_type, purpose, contact_no, email, status) VALUES (?,?,?,?,?,?,?,?)`,
      [
        transaction_id,
        profile_id,
        fullName,
        certificate_type,
        purpose,
        contact_no,
        email,
        "pending",
      ]
    );

    // insert images to db
    if (img_urls.length > 0) {
      const insertValues = img_urls.map((url) => [transaction_id, url]);
      await pool.query(
        `INSERT INTO request_certificate_resident_images (transaction_id, img_url) VALUES ?`,
        [insertValues]
      );
    }

    res.status(200).json({
      message:
        "Your request has been recorded, please copy and keep your transaction id before going.",
      transaction_id: transaction_id,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export default createRequest;
