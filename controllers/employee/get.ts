import { Request, Response } from "express";
import { retrieveAllEmployees } from "./template/retrieveEmployeeQuery";
import { retriveEmployeeById } from "./template/retrieveEmployeeQuery";

// get all
const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await retrieveAllEmployees();
    res.status(200).json(employees);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// get single
const getEmployee = async (req: Request, res: Response) => {
  try {
    const employee_id: string = req.params.employee_id;
    const employee = await retriveEmployeeById(employee_id);

    return res.status(200).json(employee);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export { getEmployees, getEmployee };
