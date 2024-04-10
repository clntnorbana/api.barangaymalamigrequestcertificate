import { Request, Response } from "express";
import { pool } from "../../config/database";
import { RowDataPacket } from "mysql2";

const getArchives = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM archives`);

    if (rows && rows.length > 0) {
      res.status(200).json(rows);
    } else {
      return [];
    }
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export default getArchives;
