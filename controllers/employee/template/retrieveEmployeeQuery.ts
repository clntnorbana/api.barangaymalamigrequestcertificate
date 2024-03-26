import { RowDataPacket } from "mysql2";
import { pool } from "../../../config/database";
import { TEmployee } from "../../../types";
import { getImagePathName } from "../../../config/cloudinary";

// retrieve all employees
const retrieveAllEmployees = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM employees`);

  if (rows && rows.length > 0) {
    const employees: TEmployee[] = rows.map((row) => {
      return row as TEmployee;
    });

    await getImagePathName(employees);

    return employees;
  } else {
    return [];
  }
};

// retrieve employee by id
const retriveEmployeeById = async (employeeId: string) => {
  const [row] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM employees WHERE employee_id = ?`,
    [employeeId]
  );

  if (row && row.length > 0) {
    const employee = row[0] as TEmployee;
    await getImagePathName(row, employee.img_url);

    return row;
  } else {
    return null;
  }
};

export { retrieveAllEmployees, retriveEmployeeById };
