import { Router } from "express";
import upload from "../middlewares/uploadMiddleware";
import createResident from "../controllers/resident/create";
import updateResident from "../controllers/resident/update";
import deleteResident from "../controllers/resident/delete";
import { requireAuth } from "../middlewares/authMiddleware";
import getProfileForgottenProfileId from "../controllers/resident/getProfileId";
import { getResident, getResidents } from "../controllers/resident/get";

const router = Router();

router.get("/get_residents", getResidents);
router.get("/get_resident/:profile_id", getResident);
router.post("/register", upload.single("img"), createResident);
router.put(
  "/update/:profile_id",
  upload.single("img"),
  requireAuth,
  updateResident
);
router.delete("/delete/:profile_id", requireAuth, deleteResident);
router.post("/get_forgotten_profileId", getProfileForgottenProfileId);

export default router;
