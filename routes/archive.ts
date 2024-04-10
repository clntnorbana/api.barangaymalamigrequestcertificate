import { Router } from "express";
import moveToArchives from "../controllers/archive/create";
import { requireAuth } from "../middlewares/authMiddleware";
import getArchives from "../controllers/archive/get";

const router = Router();

router.post("/move_to_archive", requireAuth, moveToArchives);
router.get("/get_archives", getArchives);

export default router;
