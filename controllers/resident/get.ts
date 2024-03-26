import { Request, Response } from "express";
import {
  retrieveAllResidents,
  retrieveResidentById,
} from "./template/retrieveResidentQuery";

// get all
const getResidents = async (req: Request, res: Response) => {
  try {
    const residents = await retrieveAllResidents();
    res.status(200).json(residents);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// get single
const getResident = async (req: Request, res: Response) => {
  try {
    const profile_id: string = req.params.profile_id;
    const resident = await retrieveResidentById(profile_id);

    return res.status(200).json(resident);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export { getResidents, getResident };
