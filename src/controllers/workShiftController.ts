import { Request, Response } from "express";
import { WorkShifts } from "../models/WorkShifts";
import { User } from "../models/User";


export const createWorkShift = async (req: Request, res: Response) => {
  try {
    const { user_id, expected_start_time, expected_end_time, break_minutes } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const existingShift = await WorkShifts.findOne({ where: { user_id } });
    if (existingShift) {
      return res.status(400).json({ error: "This user already has a WorkShift" });
    }

    const workShift = await WorkShifts.create({
      user_id,
      expected_start_time,
      expected_end_time,
      break_minutes,
    });

    return res.status(201).json(workShift);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};


export const getWorkShifts = async (req: Request, res: Response) => {
  try {
    const workShifts = await WorkShifts.findAll({
      include: [
        {
          model: User,
          attributes: ["name", "email"],
        },
      ],
    });

    return res.json(workShifts);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};


export const getWorkShiftById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const workShift = await WorkShifts.findByPk(id);

    if (!workShift) return res.status(404).json({ error: "WorkShift not found" });

    return res.json(workShift);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};


export const updateWorkShift = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user_id, expected_start_time, expected_end_time, break_minutes } = req.body;

    const workShift = await WorkShifts.findByPk(id);
    if (!workShift) return res.status(404).json({ error: "WorkShift not found" });

    await workShift.update({
      user_id,
      expected_start_time,
      expected_end_time,
      break_minutes,
    });

    return res.json(workShift);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};


export const deleteWorkShift = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const workShift = await WorkShifts.findByPk(id);
    if (!workShift) return res.status(404).json({ error: "WorkShift not found" });

    await workShift.destroy();

    return res.json({ message: "WorkShift deleted successfully" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
