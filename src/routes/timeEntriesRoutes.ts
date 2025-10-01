import { Router } from "express";
import {
  createUserTimeEntry,
  getUserTimeEntries,
  getTimeEntriesByUserId,
  inactivateUserTimeEntry,
  createManualTimeEntry,
  approveTimeEntry,
  rejectTimeEntry
} from "../controllers/timeEntriesController";

const router = Router();

router.post("/", createUserTimeEntry);
router.get("/", getUserTimeEntries);
router.get("/:user_id", getTimeEntriesByUserId);
router.patch("/:id", inactivateUserTimeEntry);
router.post("/manualTimeEntry", createManualTimeEntry);
router.patch("/:user_id/approve/:timeEntry_id", approveTimeEntry);
router.patch("/:user_id/reject/:timeEntry_id", rejectTimeEntry);

export default router;
