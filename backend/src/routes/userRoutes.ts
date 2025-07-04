import { Router, RequestHandler } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';

const router = Router();

// Explicitly cast each imported handler to RequestHandler
router.get('/', getAllUsers as RequestHandler);
router.get('/:id', getUserById as RequestHandler);
router.post('/', createUser as RequestHandler);
router.put('/:id', updateUser as RequestHandler);
router.delete('/:id', deleteUser as RequestHandler);

export default router;
