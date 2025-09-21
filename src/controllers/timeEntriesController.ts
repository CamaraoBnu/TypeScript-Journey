import { Request, Response } from "express";
import { TimeEntries } from "../models/TimeEntries";
import { User } from "../models/User";


export const createUserTimeEntry = async (req: Request, res: Response) => {
  try {
    const { user_id, timeEntry } = req.body;

  
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userTimeEntry = await TimeEntries.create({
      user_id,
      timeEntry,
    });

    return res.status(201).json(userTimeEntry);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};


export const getUserTimeEntries = async (req: Request, res: Response) => {
  try {
    const timeEntries = await TimeEntries.findAll({
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });
    return res.json(timeEntries);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};


export const getUserTimeEntriesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userTimeEntry = await TimeEntries.findByPk(id, {
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    if (!userTimeEntry) {
      return res.status(404).json({ error: "userTimeEntry not found" });
    }

    return res.json(userTimeEntry);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};


export const deleteUserTimeEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userTimeEntry = await TimeEntries.findByPk(id);
    if (!userTimeEntry) {
      return res.status(404).json({ error: "userTimeEntry not found" });
    }

    await userTimeEntry.destroy();
    return res.json({ message: "userTimeEntry deleted successfully" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
