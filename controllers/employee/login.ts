import { Request, Response } from "express";
import { TEmployee } from "../../types";
import { pool } from "../../config/database";
import { RowDataPacket } from "mysql2";
import { comparePassword } from "../../utils/encryptPassword";
import generateToken from "../../utils/generateToken";

const loginEmployee = async (req: Request, res: Response) => {
  try {
    const { username, password }: TEmployee = req.body;

    // check input
    if (!username || !password) {
      return res.status(400).json({ message: "Field is required" });
    }

    // get credential
    const credential = await getCredential(username);
    const employee = credential[0] as TEmployee;
    // check credential
    if (
      !employee ||
      !employee.username ||
      !(await comparePassword(password, employee.password))
    ) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // success logged in
    generateToken(res, employee.id);
    res.status(200).json({
      username: employee.username,
      employee_id: employee.employee_id,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// get credential by username
const getCredential = async (username: string) => {
  const [credential] = await pool.query<RowDataPacket[]>(
    `SELECT username, password, employee_id FROM employees WHERE username = ?`,
    [username]
  );

  return credential;
};

export default loginEmployee;
