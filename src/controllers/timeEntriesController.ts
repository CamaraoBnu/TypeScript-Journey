import { Request, Response } from "express";
import { TimeEntry } from "../models/TimeEntry";
import { User } from "../models/User";
import { sequelize } from "../database";
import { QueryTypes } from "sequelize";
import { TimeEntryStatus } from "../enums/TimeEntryStatus";
import { time } from "console";


export const createUserTimeEntry = async (req: Request, res: Response) => {
  try {
    const { user_id} = req.body;
   
  
    const user = await sequelize.query(`SELECT * FROM users WHERE id = :userId`, {
      replacements: { userId: user_id },
      type: QueryTypes.SELECT
    });
    
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentDate = Date();
    const timeEntry = new Date(currentDate);
    const status = TimeEntryStatus.ACTIVE;
    
    const userTimeEntry = await TimeEntry.create({
      user_id,
      timeEntry,
      status,
      created_by_id: user_id,
      approved_by_id: 0
    });

    return res.status(201).json(userTimeEntry);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};


export const getUserTimeEntries = async (req: Request, res: Response) => {
  try {
    const timeEntries = await TimeEntry.findAll({
      where: { status: TimeEntryStatus.ACTIVE || TimeEntryStatus.APPROVED},
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });
    return res.json(timeEntries);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};


export const getTimeEntriesByUserId = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    const userTimeEntries = await sequelize.query(
      `SELECT * FROM user_time_entries WHERE user_id = :userId AND status IN ('ACTIVE','APPROVED')`, {
      replacements: { userId: user_id },
      type: QueryTypes.SELECT
    }); 

    if (userTimeEntries.length === 0) {
      return res.status(404).json({ error: "The user does not have any time entries" });
    }

    return res.json(userTimeEntries);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};


export const inactivateUserTimeEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userTimeEntry = await TimeEntry.findByPk(id);
    if (!userTimeEntry) {
      return res.status(404).json({ error: "User time entry not found" });
    }

    userTimeEntry.status = TimeEntryStatus.INACTIVE;
    await userTimeEntry.save();

    return res.json({ message: "User time entry inactivated successfully" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const createManualTimeEntry = async (req: Request, res: Response) => {
  try {
    const { 
        user_id,
        timeEntry_user_id, 
        timeEntry,

      } = req.body;

    const performingOperationUser = await sequelize.query<User>(`SELECT * FROM users WHERE id = :userId`, {
      replacements: { userId: user_id },
      type: QueryTypes.SELECT
    });
    const timeEntryUserId = await sequelize.query<User>(`SELECT * FROM users WHERE id = :userId`, {
      replacements: { userId: timeEntry_user_id },
      type: QueryTypes.SELECT
    });
    if (!performingOperationUser || performingOperationUser.length === 0) {
      return res.status(404).json({ error: "User performig the action was not found(user_id)" });
    }
    if (!timeEntryUserId || timeEntryUserId.length === 0) {
      return res.status(404).json({ error: "User for the time entry was not found(timeEntry_user_id)" });
    }
    
    let status = TimeEntryStatus.PENDING;

    if (performingOperationUser[0]?.role === 'admin') {
      status = TimeEntryStatus.APPROVED;
    }
    
    const userTimeEntry = await TimeEntry.create({
      user_id: timeEntry_user_id,
      timeEntry,
      status,
      created_by_id: user_id,
      approved_by_id: performingOperationUser[0]?.role === 'admin' ? user_id : 0
    });

    return res.status(201).json(userTimeEntry);
    
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const approveTimeEntry = async (req: Request, res: Response) => {
  try {
    const { 
      user_id,
      timeEntry_id
    } = req.body;
    
    const timeEntry = await TimeEntry.findByPk(timeEntry_id);
    if (!timeEntry) {
      return res.status(404).json({ error: "User time entry not found" });
    }
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ error: "Only admin users can approve time entries" });
    }
    if (timeEntry.status !== TimeEntryStatus.PENDING) {
      return res.status(400).json({ error: "Only PENDING time entries can be approved" });
    }

    timeEntry.status = TimeEntryStatus.APPROVED;
    timeEntry.approved_by_id = user_id;
    await timeEntry.save();

    return res.json({ message: "User time entry APPROVED successfully" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const rejectTimeEntry = async (req: Request, res: Response) => {
    try {
    const { 
      user_id,
      timeEntry_id
    } = req.body;

    const timeEntry = await TimeEntry.findByPk(timeEntry_id);
    if (!timeEntry) {
      return res.status(404).json({ error: "User time entry not found" });
    }
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ error: "Only admin users can reject time entries" });
    }
    if (timeEntry.status !== TimeEntryStatus.PENDING) {
      return res.status(400).json({ error: "Only PENDING time entries can be rejected" });
    }

    timeEntry.status = TimeEntryStatus.REJECTED;
    timeEntry.approved_by_id = user_id;
    await timeEntry.save();

    return res.json({ message: "User time entry REJECTED successfully" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
