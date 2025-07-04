import { Request, Response } from 'express';
import { query, execute } from '../models/db';
import { userSchema } from '../validations/userValidation';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Define User type
interface User extends RowDataPacket {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  panNumber: string;
  createdAt: string;
  updatedAt: string;
}

// GET /api/users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await query<User>('SELECT * FROM users');
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// GET /api/users/:id
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const users = await query<User>('SELECT * FROM users WHERE id = ?', [id]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(users[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// POST /api/users
export const createUser = async (req: Request, res: Response) => {
  try {
    const validated = userSchema.parse(req.body);

    const existing = await query<User>('SELECT * FROM users WHERE email = ?', [validated.email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const result = await execute(
      `INSERT INTO users 
       (firstName, lastName, email, phoneNumber, panNumber, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        validated.firstName,
        validated.lastName,
        validated.email,
        validated.phoneNumber,
        validated.panNumber,
      ]
    );

    const insertResult = result as ResultSetHeader;
    res.status(201).json({ message: 'User created', userId: insertResult.insertId });
  } catch (err: any) {
    res.status(400).json({ error: err.errors || 'Invalid data' });
  }
};

// PUT /api/users/:id
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const validated = userSchema.parse(req.body);

    const existing = await query<User>('SELECT * FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await execute(
      `UPDATE users 
       SET firstName = ?, lastName = ?, email = ?, phoneNumber = ?, panNumber = ?, updatedAt = NOW()
       WHERE id = ?`,
      [
        validated.firstName,
        validated.lastName,
        validated.email,
        validated.phoneNumber,
        validated.panNumber,
        id,
      ]
    );

    res.status(200).json({ message: 'User updated' });
  } catch (err: any) {
    res.status(400).json({ error: err.errors || 'Invalid data' });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const existing = await query<User>('SELECT * FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await execute('DELETE FROM users WHERE id = ?', [id]);
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
