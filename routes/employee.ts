import { Router } from "express";
import createEmployee from "../controllers/employee/create";
import upload from "../middlewares/uploadMiddleware";
import {
  updateAdminRole,
  updateEmployee,
  updatePassword,
} from "../controllers/employee/update";
import { deleteAccount, deleteEmployee } from "../controllers/employee/delete";
import loginEmployee from "../controllers/employee/login";
import logoutEmployee from "../controllers/employee/logout";
import { requireAuth } from "../middlewares/authMiddleware";
import { getEmployee, getEmployees } from "../controllers/employee/get";

const router = Router();

router.get("/get_employees", getEmployees);
router.get("/get_employee/:employee_id", getEmployee);
router.post("/create", requireAuth, createEmployee);
router.post("/login", loginEmployee);
router.post("/logout", logoutEmployee);
router.put(
  "/update_employee/:employee_id",
  requireAuth,
  upload.single("img"),
  updateEmployee
);
router.put("/update_password/:employee_id", requireAuth, updatePassword);
router.put("/update_role/:employee_id", requireAuth, updateAdminRole);
router.delete("/delete_account/:employee_id", requireAuth, deleteAccount);
router.delete("/delete_employee/:employee_id", requireAuth, deleteEmployee);

export default router;
