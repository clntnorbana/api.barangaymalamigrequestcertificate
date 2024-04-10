import { Router } from "express";
import moveToArchives from "../controllers/archive/create";
import { requireAuth } from "../middlewares/authMiddleware";
import getArchives from "../controllers/archive/get";
import {
  deleteAllArchives,
  deleteSingleArchive,
} from "../controllers/archive/delete";

const router = Router();

router.post("/move_to_archive", requireAuth, moveToArchives);
router.get("/get_archives", getArchives);
router.delete("/delete_all", requireAuth, deleteAllArchives);
router.delete(
  "/delete_single/:transaction_id",
  requireAuth,
  deleteSingleArchive
);

export default router;
