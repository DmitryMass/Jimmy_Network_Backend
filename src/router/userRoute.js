import { Router } from 'express';
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from '../controllers/users.js';
import { verifyToken } from '../middleware/verifyUserToken.js';

const router = Router();

router.get('/:id', verifyToken, getUser);
router.get('/:id/:friends', verifyToken, getUserFriends);
router.patch('/:id/:friendId', verifyToken, addRemoveFriend);

export default router;
