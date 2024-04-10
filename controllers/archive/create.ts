import { Request, Response } from "express";
import { pool } from "../../config/database";
import { TEmployee } from "../../types";
import { retriveEmployeeById } from "../employee/template/retrieveEmployeeQuery";
import { comparePassword } from "../../utils/encryptPassword";

const moveToArchives = async (req: Request, res: Response) => {
  try {
    const { employee_id, password }: TEmployee = req.body;

    const employee = await retriveEmployeeById(employee_id);

    if (!employee) {
      return res.status(400).json({ message: "Employee not found" });
    }

    const info = employee[0] as TEmployee;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (!(await comparePassword(password, info.password))) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // Move data to archives
      const moveQuery = `
        INSERT INTO archives (transaction_id, profile_id, request_by, certificate_type, purpose, contact_no, email, status, request_date)
        SELECT transaction_id, profile_id, request_by, certificate_type, purpose, contact_no, email, status, request_date
        FROM request_certificate WHERE status IN ('approved', 'rejected')
      `;
      await conn.query(moveQuery);

      // Delete data from request_certificate
      await conn.query(
        "DELETE FROM request_certificate WHERE status IN ('approved', 'rejected')"
      );

      await conn.commit();
      conn.release();

      return res
        .status(200)
        .json({ message: "Data moved to archives successfully" });
    } catch (error) {
      await conn.rollback();
      conn.release();
      console.error("Error moving data to archives:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while moving data to archives" });
    }
  } catch (error) {
    console.error("Error in moveToArchives function:", error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred" });
  }
};

export default moveToArchives;
