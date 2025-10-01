import { Request, Response } from "express";
import { User } from "../models/User";
import { sequelize } from "../database";
import { QueryTypes, Transaction } from "sequelize";


export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (await emailExists(email, 0)) {
      return res.status(400).json({ error: "Email already recorded on another user" });
    }

    const user = await User.create({ name, email, password, role });
    return res.status(201).json(user);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};


export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};


export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json(user);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};


export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    return await sequelize.transaction(async (t) => { 
      
      const user = await User.findByPk(id, {transaction: t, lock: t.LOCK.NO_KEY_UPDATE});
      if (!user) return res.status(404).json({ error: "User not found" });
      
      if (await emailExists(email, user.id)) {
        return res.status(400).json({ error: "Email already recorded on another user" });
      }

      await user.update({ name, email, password, role }, {transaction: t});
      return res.json(user);
    });
    
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await sequelize.query('select :id ', { type: QueryTypes.DELETE, replacements: {id} });

    return await sequelize.transaction(async (t) => {
      const user = await User.findByPk(id, {transaction: t, lock: t.LOCK.NO_KEY_UPDATE});
      if (!user) return res.status(404).json({ error: "User not found" });

      await user.destroy({transaction: t});

      return res.json({ message: "User deleted successfully" });
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};


const emailExists = async (email: string, ignoredUserId?: number | null): Promise<boolean> => {

  const emailSearch = await sequelize.query('select email from users where email = :email and (id != :ignoredUserId OR :ignoredUserId is null)', { 
    type: QueryTypes.SELECT, 
    replacements: { email, ignoredUserId } 
  });

  if (emailSearch.length > 0) {
    return true;
  }
  return false;
}

