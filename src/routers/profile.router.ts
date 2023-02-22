import { Router } from 'express';
import { getUserProfile, updateUserAvatar, updateUserBody } from '../controllers/user.controller';
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
profileRouter.put('/settings/avatar/:userId', authMiddleware, ownerMiddleware, updateUserAvatar);
profileRouter.put(
  '/settings/toggle-block/:userId',
  authMiddleware,
  adminMiddleware,
  updateUserBody,
);
profileRouter.put('/settings/make-admin/:userId', authMiddleware, adminMiddleware, updateUserBody);

export default profileRouter;
