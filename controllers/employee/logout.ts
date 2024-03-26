import { Request, Response } from "express";

const logoutEmployee = async (req: Request, res: Response) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "logout" });
};

export default logoutEmployee;
