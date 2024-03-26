import { Request, Response } from "express";
import { pool } from "../../config/database";
import { RowDataPacket } from "mysql2";

const getRecords = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM request_certificate_record`
    );
    if (rows && rows.length > 0) {
      res.status(200).json(rows);
    } else {
      return [];
    }
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export default getRecords;
