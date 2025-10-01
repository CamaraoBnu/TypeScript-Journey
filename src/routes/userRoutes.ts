import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import Joi from "joi";
import { validate } from "../middlewares/validateJOI";

const validateUser = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "employee").required(),
});

const router = Router();

router.post("/", validate(validateUser), createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", validate(validateUser), updateUser);
router.delete("/:id", deleteUser);

export default router;
