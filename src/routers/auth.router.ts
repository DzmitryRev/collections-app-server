import { Router } from 'express';
import {
  login,
  logout,
  confirmEmail,
  refreshTokens,
  sendNewPassword,
  registration,
  changePassword,
} from '../controllers/auth.controller';
import {
  validateLogin,
  validateRegister,
  validateResetPassword,
} from '../validation/auth.validation';

const authRouter = Router();

authRouter.post('/registration', validateRegister, registration);
authRouter.post('/login', validateLogin, login);
authRouter.post('/logout', logout);
authRouter.get('/refresh', refreshTokens);
authRouter.get('/activate/:token', confirmEmail);
authRouter.post('/resetPassword', validateResetPassword, sendNewPassword);
authRouter.get('/resetPassword/:token', changePassword);

export default authRouter;
