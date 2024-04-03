import { Request, Response } from "express";
import { TResident } from "../../types";
import { pool } from "../../config/database";
import { RowDataPacket } from "mysql2";
import formatContactNo from "../../utils/formatContactNo";
import sendSMS from "../../config/twilio";

const getProfileForgottenProfileId = async (req: Request, res: Response) => {
  try {
    const { contact_no }: TResident = req.body;

    if (!contact_no) {
      return res.status(400).json({ message: "Please type your phone number" });
    }

    const [row] = await pool.query<RowDataPacket[]>(
      `SELECT profile_id, firstname, lastname, contact_no FROM residents WHERE contact_no = ?`,
      [contact_no]
    );

    if (!row[0]) {
      return res.status(404).json({
        message:
          "The phone number you provided does not exist in the database. Please try again.",
      });
    }

    const formattedContactNo = formatContactNo("09066128262");
    const message = `${row[0].firstname} ${row[0].lastname}, (${row[0].profile_id})`;

    if (formattedContactNo) {
      sendSMS(message, "+639066128262");
    }

    res.status(200).json({
      message: `Your profile ID has been sent to your phone number (${formattedContactNo})`,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export default getProfileForgottenProfileId;
