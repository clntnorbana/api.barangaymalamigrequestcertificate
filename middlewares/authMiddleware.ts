import jwt, { JwtPayload } from "jsonwebtoken";
import { pool } from "../config/database";
import { Request, Response, NextFunction } from "express";

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  token = req.cookies.jwt;

  if (!token) {
    return res.status(400).json({
      message: "unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    req.userData = await pool.query(`SELECT * FROM employees WHERE id = ?`, [
      decoded.userId,
    ]);

    next();
  } catch (error: unknown) {
    console.error("Unexpected error", error);
  }
};

export { requireAuth };
