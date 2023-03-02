import { Router } from 'express';
import { getUserProfile, updateUserBody } from '../controllers/user.controller';
import { adminMiddleware } from '../middlewares/admin.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { ownerMiddleware } from '../middlewares/owner.middleware';
import { validateUpdateUserBody } from '../validation/profile.validation';

const profileRouter = Router();

profileRouter.get('/user/:userId', getUserProfile);
profileRouter.put(
  '/settings/:userId',
  authMiddleware,
  ownerMiddleware,
  validateUpdateUserBody,
  updateUserBody,
);

profileRouter.put('/settings/admin/:userId', authMiddleware, adminMiddleware, updateUserBody);

export default profileRouter;
