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
router.patch("/approve/", approveTimeEntry);
router.patch("/reject", rejectTimeEntry);

export default router;
