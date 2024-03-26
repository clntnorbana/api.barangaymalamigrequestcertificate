import { Request, Response } from "express";
import validator from "validator";
import { TResident } from "../../types";
import { retrieveAllResidents } from "./template/retrieveResidentQuery";
import { uploadResult } from "../../config/cloudinary";
import generateId from "../../utils/generateId";
import { pool } from "../../config/database";

const createResident = async (req: Request, res: Response) => {
  try {
    const {
      firstname,
      lastname,
      middlename,
      sex,
      date_of_birth,
      place_of_birth,
      contact_no,
      email,
      citizenship,
      religion,
      civil_status,
      company,
      occupation,
      number_street,
      voter,
    }: TResident = req.body;

    // check inputs
    if (
      !firstname ||
      !lastname ||
      !sex ||
      !date_of_birth ||
      !place_of_birth ||
      !contact_no ||
      !citizenship ||
      !civil_status ||
      !number_street ||
      !voter
    ) {
      return res.status(400).json({ message: "Fill the required fields" });
    }

    // check email
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Email is invalid" });
    }

    // data already exists
    const residents = await retrieveAllResidents();
    if (residents) {
      for (const resident of residents) {
        // contact_no exists
        if (resident.contact_no === contact_no) {
          return res
            .status(400)
            .json({ message: "STEP 2: Phone number is already used" });
        }

        // email exists
        if (email && resident.email === email) {
          return res
            .status(400)
            .json({ message: "STEP 2: Email is already used" });
        }
      }
    }

    // upload image
    let imgUrl: string = "";
    if (req.file) {
      const result = await uploadResult(req.file.path, "residents");
      imgUrl = result.public_id;
    }

    // generate id
    const profileId = generateId("PRF");

    // insert to db
    await pool.query(
      `INSERT INTO residents (profile_id, img_url, firstname, lastname, middlename, sex, date_of_birth, place_of_birth, contact_no, email, citizenship, religion, civil_status, company, occupation, number_street, barangay, city, zip_code, voter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        profileId,
        imgUrl,
        firstname,
        lastname,
        middlename,
        sex,
        date_of_birth,
        place_of_birth,
        contact_no,
        email,
        citizenship,
        religion,
        civil_status,
        company,
        occupation,
        number_street,
        "malamig",
        "mandaluyong city",
        "1550",
        voter,
      ]
    );

    res.status(200).json({
      message:
        "Your information has been recorded, please copy and keep your profile ID, before returning to homepage.",
      profileId: profileId,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export default createResident;
