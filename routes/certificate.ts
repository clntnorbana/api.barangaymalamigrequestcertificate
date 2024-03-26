import { Router } from "express";
import {
  getRequestCertificate,
  getRequestCertificates,
} from "../controllers/certificate/get";
import createRequest from "../controllers/certificate/create";
import upload from "../middlewares/uploadMiddleware";
import deleteRequest from "../controllers/certificate/delete";
import { requireAuth } from "../middlewares/authMiddleware";
import {
  approveRequest,
  rejectRequest,
  undoReject,
  updatePurpose,
} from "../controllers/certificate/update";

const router = Router();

router.get("/get_requests", getRequestCertificates);
router.get("/get_request/:transaction_id", getRequestCertificate);
router.post("/request_certificate", upload.array("img", 4), createRequest);
router.delete("/delete_request/:transaction_id", requireAuth, deleteRequest);
router.put("/approve_request/:transaction_id", requireAuth, approveRequest);
router.put("/reject_request/:transaction_id", requireAuth, rejectRequest);
router.put("/undo_reject/:transaction_id", requireAuth, undoReject);
router.put("/update_purpose/:transaction_id", requireAuth, updatePurpose);

export default router;
