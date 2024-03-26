import { Request, Response } from "express";
import { TResident } from "../../types";
import validator from "validator";
import {
  retrieveAllResidents,
  retrieveResidentById,
} from "./template/retrieveResidentQuery";
import { extractPublicIdFromUrl, uploadResult } from "../../config/cloudinary";
import { pool } from "../../config/database";
import deletePrevImage from "./template/deleteResidentImg";

const updateResident = async (req: Request, res: Response) => {
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

    const profile_id: string = req.params.profile_id;

    if (
      !firstname ||
      !lastname ||
      !sex ||
      !date_of_birth ||
      !contact_no ||
      !citizenship ||
      !voter ||
      !number_street ||
      !civil_status
    ) {
      return res.status(400).json({ message: "Fill all required fields" });
    }

    // check email
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Email is invalid" });
    }

    // check contact_no
    if (contact_no && contact_no.length !== 11) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // data already exists?
    const residents = await retrieveAllResidents();
    if (residents) {
      for (const resident of residents) {
        if (resident.profile_id !== profile_id) {
          // contact_no exists?
          if (resident.contact_no === contact_no) {
            return res
              .status(400)
              .json({ message: "Phone number already exists" });
          }

          // email exists?
          if (resident.email === email) {
            return res.status(400).json({ message: "Email is already used" });
          }
        }
      }
    }

    // upload image
    let imgUrl: string | null = "";
    if (req.file) {
      // delete prev image
      await deletePrevImage(profile_id);
      // upload new image
      const result = await uploadResult(req.file.path, "residents");
      imgUrl = result.public_id;
    } else {
      const resident = await retrieveResidentById(profile_id);
      if (resident && resident.length > 0) {
        const info = resident[0] as TResident;

        if (info.img_url) {
          imgUrl = extractPublicIdFromUrl(info.img_url);
        }
      }
    }

    // update query
    await pool.query(
      `UPDATE residents SET img_url = ?, firstname = ?, lastname = ?, middlename = ?, sex = ?, date_of_birth = ?, place_of_birth = ?, contact_no = ?, email = ?, citizenship = ?, religion = ?, civil_status = ?, company = ?, occupation = ?, number_street = ?, voter = ? WHERE profile_id = ?`,
      [
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
        voter,
        profile_id,
      ]
    );

    res
      .status(200)
      .json({ message: "Resident's information updated successfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export default updateResident;
