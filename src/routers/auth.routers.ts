import { Router } from 'express';
import {
  login,
  logout,
  register,
  verifyEmail,
  refreshTokens,
  checkAccessToChangingPassword,
  confirmNewPassword,
} from '../controllers/auth.controller';
import {
  validateLogin,
  validateRegister,
  validateResetPassword,
} from '../validation/auth.validation';

const authRouter = Router();

authRouter.post('/registration', validateRegister, register);
authRouter.post('/login', validateLogin, login);
authRouter.post('/logout', logout);
authRouter.get('/refresh', refreshTokens);
authRouter.get('/activate/:token', verifyEmail);
authRouter.post('/resetPassword', validateResetPassword, checkAccessToChangingPassword);
authRouter.get('/resetPassword/:token', confirmNewPassword);

export default authRouter;
