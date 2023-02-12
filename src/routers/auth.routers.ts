import { Router } from 'express';
import {
  login, logout, register, rem, get, verifyEmail, refreshTokens,
} from '../controllers/auth.controller';
import { validateLogin, validateRegister } from '../validation/auth.validation';
// import authController from "../controllers/auth-controller";

const authRouter = Router();

authRouter.post('/registration', validateRegister, register);
authRouter.post('/login', validateLogin, login);
authRouter.post('/logout', logout);
authRouter.get('/refresh', refreshTokens);
authRouter.get('/activate/:token', verifyEmail);
// authRouter.get('/activate/:link', authController.activate);
// authRouter.get('/resetPassword/:link', authController.activate);
// authRouter.post('/resetPassword/:link', authController.activate);

authRouter.get('/rem', rem);
authRouter.get('/gets', get);
export default authRouter;
