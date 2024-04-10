import { Request, Response } from "express";
import { pool } from "../../config/database";
import { TEmployee } from "../../types";
import { retriveEmployeeById } from "../employee/template/retrieveEmployeeQuery";
import { comparePassword } from "../../utils/encryptPassword";

// delete single archive
const deleteSingleArchive = async (req: Request, res: Response) => {
  try {
    const transaction_id: string = req.params.transaction_id;

    await pool.query(`DELETE FROM archives WHERE transaction_id = ?`, [
      transaction_id,
    ]);

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// delete all archives
const deleteAllArchives = async (req: Request, res: Response) => {
  try {
    const { employee_id, password }: TEmployee = req.body;

    const employee = await retriveEmployeeById(employee_id);

    // check employee
    if (!employee) {
      return res.status(400).json({ message: "Employee do not exists" });
    }

    const info = employee[0] as TEmployee;

    // check password input field
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // password validation
    if (!(await comparePassword(password, info.password))) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    await pool.query(`DELETE FROM archives`);

    res.status(200).json({ message: "Archive has been cleared" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export { deleteSingleArchive, deleteAllArchives };
