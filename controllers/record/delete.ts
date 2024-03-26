import { Request, Response } from "express";
import { TEmployee } from "../../types";
import { pool } from "../../config/database";
import { retriveEmployeeById } from "../employee/template/retrieveEmployeeQuery";
import { comparePassword } from "../../utils/encryptPassword";

// delete all
const deleteAll = async (req: Request, res: Response) => {
  try {
    const { password, employee_id }: TEmployee = req.body;

    // check password
    if (!password) {
      return res.status(400).json({ message: "Field is required" });
    }

    const employee = await retriveEmployeeById(employee_id);
    let employeePassword: string = "";

    if (employee) {
      const employeeInfo = employee[0] as TEmployee;

      if (employeeInfo) {
        employeePassword = employeeInfo.password;
      }
    }

    // password validation
    if (!(await comparePassword(password, employeePassword))) {
      return res.status(400).json({ message: "Invalid password, try again" });
    }

    // delete query
    await pool.query(`DELETE FROM request_certificate_record`);

    res.status(200).json({ message: "Records deleted successfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// delete single
const deleteRecord = async (req: Request, res: Response) => {
  try {
    const transaction_id: string = req.params.transaction_id;

    if (!transaction_id) {
      return res.status(404).json({ message: "Transaction do not found" });
    }

    await pool.query(
      `DELETE FROM request_certificate_record WHERE transaction_id = ?`,
      [transaction_id]
    );

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export { deleteAll, deleteRecord };
