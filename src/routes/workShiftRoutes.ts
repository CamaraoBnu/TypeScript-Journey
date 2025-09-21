import { Router } from "express";
import {
  createWorkShift,
  getWorkShifts,
  getWorkShiftById,
  updateWorkShift,
  deleteWorkShift,
} from "../controllers/workShiftController";

const router = Router();

router.post("/", createWorkShift);
router.get("/", getWorkShifts);
router.get("/:id", getWorkShiftById);
router.put("/:id", updateWorkShift);
router.delete("/:id", deleteWorkShift);

export default router;
