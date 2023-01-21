import { Router } from 'express';
import {
  deletePost,
  getUserPosts,
  getUsersPosts,
  likedPost,
} from '../controllers/posts.js';
import { verifyToken } from '../middleware/verifyUserToken.js';

const router = Router();

router.get('/', verifyToken, getUsersPosts);
router.get('/:userId/posts', verifyToken, getUserPosts);
router.patch('/:id/like', verifyToken, likedPost);
router.delete('/:id/posts', verifyToken, deletePost);

export default router;
