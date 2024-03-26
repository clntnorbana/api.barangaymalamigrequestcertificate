import { Request, Response } from "express";
import { TEmployee } from "../../types";
import { retrieveAllEmployees } from "./template/retrieveEmployeeQuery";
import validator from "validator";
import generateId from "../../utils/generateId";
import { hashPassword } from "../../utils/encryptPassword";
import { pool } from "../../config/database";

const createEmployee = async (req: Request, res: Response) => {
  try {
    const {
      username,
      password,
      admin_role,
      firstname,
      lastname,
      email,
      contact_no,
    }: TEmployee = req.body;

    // check inputs
    if (!username || !password || !admin_role) {
      return res
        .status(400)
        .json({ message: "Please fill the required fields" });
    }

    // data already exists?
    const employees = await retrieveAllEmployees();
    if (employees) {
      for (const employee of employees) {
        // username exists?
        if (employee.username === username) {
          return res.status(400).json({ message: "username is already used" });
        }

        // contact_no exists?
        if (contact_no && employee.contact_no === contact_no) {
          return res
            .status(400)
            .json({ message: "phone number is already used" });
        }

        // email exists?
        if (email && employee.email === email) {
          return res.status(400).json({ message: "email is already used" });
        }
      }
    }

    // check password strength
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: "Password is not strong enough" });
    }

    // check email if valid
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Email is invalid" });
    }

    // check contact number length
    if (contact_no && contact_no.length !== 11) {
      return res.status(400).json({ message: "Phone number is invalid" });
    }

    const employeeId = generateId("EMP");
    const status = "away";
    const defaultContact = contact_no ? contact_no : null;
    const defaultEmail = email ? email : null;
    const defaultFirstname = firstname ? firstname : null;
    const defaultLastname = lastname ? lastname : null;
    const hashedPassword = await hashPassword(password);

    await pool.query(
      `INSERT INTO employees (employee_id, admin_role, username, password, firstname, lastname, email, contact_no, status) VALUES (?,?,?,?,?,?,?,?, ?)`,
      [
        employeeId,
        admin_role,
        username,
        hashedPassword,
        defaultFirstname,
        defaultLastname,
        defaultEmail,
        defaultContact,
        status,
      ]
    );

    res.status(200).json({ message: "New account successfully created." });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export default createEmployee;
