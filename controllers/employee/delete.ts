import { Request, Response } from "express";
import { TEmployee } from "../../types";
import { retriveEmployeeById } from "./template/retrieveEmployeeQuery";
import { comparePassword } from "../../utils/encryptPassword";
import deletePrevImage from "./template/deleteEmployeeImg";
import { pool } from "../../config/database";

// delete account
const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { password }: TEmployee = req.body;
    const employee_id: string = req.params.employee_id;

    const employee = await retriveEmployeeById(employee_id);
    if (employee) {
      const info = employee[0] as TEmployee;
      if (!(await comparePassword(password, info.password))) {
        return res.status(400).json({ message: "Invalid password" });
      }

      // delete prev image
      if (info.img_url !== null) {
        await deletePrevImage(info.employee_id);
      }
    }

    // delete query
    await pool.query(`DELETE FROM employees WHERE employee_id = ?`, [
      employee_id,
    ]);

    res.status(200).json({ message: "Account deleted" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// delete employee
const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const employee_id: string = req.params.employee_id;

    // check id
    if (!employee_id) {
      return res.status(400).json({ message: "Employee do not exists" });
    }

    const employee = await retriveEmployeeById(employee_id);
    if (employee) {
      const info = employee[0] as TEmployee;

      // delete prev image
      if (info.img_url !== null) {
        await deletePrevImage(info.employee_id);
      }
    }

    await pool.query(`DELETE FROM employees WHERE employee_id = ?`, [
      employee_id,
    ]);

    res.status(200).json({ message: "Account deleted" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export { deleteAccount, deleteEmployee };
