import { Request, Response } from "express";
import deletePrevImage from "./template/deleteResidentImg";
import { pool } from "../../config/database";
import { TEmployee } from "../../types";
import { retriveEmployeeById } from "../employee/template/retrieveEmployeeQuery";
import { comparePassword } from "../../utils/encryptPassword";

const deleteResident = async (req: Request, res: Response) => {
  try {
    const { employee_id, password }: TEmployee = req.body;
    const profile_id = req.params.profile_id;

    // check id
    if (!profile_id) {
      return res.status(404).json({ message: "Resident do not exists" });
    }

    // check password input
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const employee = await retriveEmployeeById(employee_id);
    if (employee) {
      const info = employee[0] as TEmployee;

      if (!(await comparePassword(password, info.password))) {
        return res.status(400).json({ message: "Password is incorrect" });
      }

      // delete image
      await deletePrevImage(profile_id);

      await pool.query(`DELETE FROM residents WHERE profile_id = ?`, [
        profile_id,
      ]);

      res.status(200).json({ message: "Resident deleted successfully" });
    }
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export default deleteResident;
