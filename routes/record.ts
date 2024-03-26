import { Router } from "express";
import getRecords from "../controllers/record/get";
import { deleteAll, deleteRecord } from "../controllers/record/delete";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.get("/get_records", getRecords);
router.delete("/delete_records", requireAuth, deleteAll);
router.delete("/delete_record/:transaction_id", deleteRecord);

export default router;
