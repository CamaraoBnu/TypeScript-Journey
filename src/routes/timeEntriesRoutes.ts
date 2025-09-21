import { Router } from "express";
import {
  createUserTimeEntry,
  getUserTimeEntries,
  getUserTimeEntriesById,
  deleteUserTimeEntry,
} from "../controllers/timeEntriesController";

const router = Router();

router.post("/", createUserTimeEntry);
router.get("/", getUserTimeEntries);
router.get("/:id", getUserTimeEntriesById);
router.delete("/:id", deleteUserTimeEntry);

export default router;
