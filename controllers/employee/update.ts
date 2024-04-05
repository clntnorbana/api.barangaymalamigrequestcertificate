import { Request, Response } from "express";
import { TEmployee } from "../../types";
import validator from "validator";
import {
  retrieveAllEmployees,
  retriveEmployeeById,
} from "./template/retrieveEmployeeQuery";
import { comparePassword, hashPassword } from "../../utils/encryptPassword";
import deletePrevImage from "./template/deleteEmployeeImg";
import { extractPublicIdFromUrl, uploadResult } from "../../config/cloudinary";
import { pool } from "../../config/database";
import formatContactNo from "../../utils/formatContactNo";
import generatedPassword from "../../utils/generatePassword";
import sendSMS from "../../config/twilio";

// update information
const updateEmployee = async (req: Request, res: Response) => {
  try {
    const {
      username,
      password,
      firstname,
      lastname,
      middlename,
      contact_no,
      email,
    }: TEmployee = req.body;

    const employee_id: string = req.params.employee_id;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (!username) {
      return res.status(400).json({ message: "Username cannot be empty" });
    }

    if (!firstname || !lastname) {
      return res
        .status(400)
        .json({ message: "First name or last name cannot be empty" });
    }

    if (!contact_no) {
      return res.status(400).json({ message: "Phone number cannot be empty" });
    }

    if (contact_no.length !== 11) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // data already exists?
    const employees = await retrieveAllEmployees();
    if (employees) {
      for (const employee of employees) {
        if (employee.employee_id !== employee_id) {
          // username exists
          if (employee.username === username) {
            return res
              .status(400)
              .json({ message: "Username is already used" });
          }

          // contact_ exists
          if (employee.contact_no === contact_no) {
            return res
              .status(400)
              .json({ message: "Phone number is already used" });
          }

          // email exists
          if (employee.email === email) {
            return res
              .status(400)
              .json({ message: "Email address is already used" });
          }
        }
        // compare password
        if (employee.employee_id === employee_id) {
          if (!(await comparePassword(password, employee.password))) {
            return res
              .status(400)
              .json({ message: "Invalid password, try again." });
          }
        }
      }
    }

    // image upload
    let imgUrl: string | null = "";
    if (req.file) {
      // delete prev image
      await deletePrevImage(employee_id);
      // upload new image
      const result = await uploadResult(req.file.path, "employees");
      imgUrl = result.public_id;
    } else {
      const employee = await retriveEmployeeById(employee_id);
      if (employee && employee.length > 0) {
        const info = employee[0] as TEmployee;

        if (info.img_url) {
          imgUrl = extractPublicIdFromUrl(info.img_url);
        }
      }
    }

    // update query
    await pool.query(
      `UPDATE employees SET img_url = ?, username = ?, firstname = ?, middlename = ?, lastname = ?, email = ?, contact_no = ? WHERE employee_id = ?`,
      [
        imgUrl,
        username,
        firstname,
        middlename,
        lastname,
        email,
        contact_no,
        employee_id,
      ]
    );

    res
      .status(200)
      .json({ message: "Your information is successfully updated" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// update password
type TUpdatePassword = {
  currentPassword: string;
  newPassword: string;
};

const updatePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword }: TUpdatePassword = req.body;
    const employee_id: string = req.params.employee_id;

    // check input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Field is required" });
    }

    // check password strength
    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({ message: "Password is not strong enough" });
    }

    // check password validation
    const employee = await retriveEmployeeById(employee_id);
    if (employee) {
      const info = employee[0] as TEmployee;

      if (!(await comparePassword(currentPassword, info.password))) {
        return res.status(400).json({ message: "Invalid current password" });
      }
    }

    // current password same as new one
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the current one",
      });
    }

    // encrypt password
    const hashedPassword = await hashPassword(newPassword);

    await pool.query(
      `UPDATE employees SET password = ? WHERE employee_id = ?`,
      [hashedPassword, employee_id]
    );

    return res
      .status(200)
      .json({ message: "Password is updated successfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// update admin role
const updateAdminRole = async (req: Request, res: Response) => {
  try {
    const employee_id: string = req.params.employee_id;

    const employee = await retriveEmployeeById(employee_id);

    let newAdminRole: string = "";
    if (employee) {
      const info = employee[0] as TEmployee;

      newAdminRole = info.admin_role === "editor" ? "normal" : "editor";
    }

    // update query
    pool.query(`UPDATE employees SET admin_role = ? WHERE employee_id = ?`, [
      newAdminRole,
      employee_id,
    ]);

    res.status(200).json({ message: `Admin role changed to ${newAdminRole}` });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// change password
const changeForgottenPassword = async (req: Request, res: Response) => {
  try {
    const { employee_id, contact_no }: TEmployee = req.body;

    // check inputs
    if (!employee_id || !contact_no) {
      return res.status(400).json({ message: "Field is required" });
    }

    const employee = await retriveEmployeeById(employee_id);

    if (!employee || employee.length === 0) {
      return res.status(400).json({ message: "Employee id do not exists" });
    }

    const info = employee[0] as TEmployee;

    // check phone number
    if (contact_no !== info.contact_no) {
      return res.status(400).json({ message: "Phone number do not exists" });
    }

    const newPassword = generatedPassword(8);
    const hashedPassword = await hashPassword(newPassword);
    const formattedContactNo = formatContactNo(info.contact_no);

    await pool.query(
      `UPDATE employees SET password = ? WHERE employee_id = ?`,
      [hashedPassword, employee_id]
    );

    if (formattedContactNo) {
      sendSMS(
        `${info.firstname} ${info.lastname} (${employee_id}), your new password is: ${newPassword}`,
        formattedContactNo
      );
    }

    res.status(200).json({
      message: `Your new password has been sent to your phone (${info.contact_no})`,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export {
  updateEmployee,
  updatePassword,
  updateAdminRole,
  changeForgottenPassword,
};
