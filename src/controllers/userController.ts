import { Request, Response } from "express";
import { User } from "../models/User";


export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
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

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update({ name, email, password, role });

    return res.json(user);
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();

    return res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
