import { RowDataPacket } from "mysql2";
import { pool } from "../../../config/database";
import { TImages, TRequestCertificate } from "../../../types";

const retrieveAllRequestCertificate = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM request_certificate`
  );

  if (rows && rows.length > 0) {
    const requests: TRequestCertificate[] = rows.map((row) => {
      return row as TRequestCertificate;
    });

    return requests;
  } else {
    return [];
  }
};

// retrive request certificate by id
const retrieveRequestCertificateById = async (transaction_id: string) => {
  const [row] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM request_certificate WHERE transaction_id = ?`,
    [transaction_id]
  );

  if (row && row.length > 0) {
    const request = row[0] as TRequestCertificate;

    // get images
    const images = await getImages(transaction_id);
    // add images as property
    request.images = images ? images.map((image) => image.img_url) : [];
  }

  return row;
};

// get images provided
const getImages = async (transaction_id: string) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT img_url FROM request_certificate_resident_images WHERE transaction_id = ?`,
    [transaction_id]
  );

  if (rows && rows.length > 0) {
    const images: TImages[] = rows.map((row) => {
      return row as TImages;
    });

    return images;
  } else {
    return [];
  }
};

export { retrieveAllRequestCertificate, retrieveRequestCertificateById };
