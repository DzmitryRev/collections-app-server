/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { COOKIE_AGE, REFRESH_COOKIE_NAME } from '../constants/cookie.const';
import { SUCCESSFUL_LOGOUT, SUCCESSFUL_REGISTR } from '../constants/success-messages.const';
import tokenModel from '../models/token.model';
import User from '../models/user.model';
import AuthService from '../services/auth.service';
import MailService from '../services/mail-service';
import TokenService from '../services/token.service';
import UserService from '../services/user.service';
import SuccessMessage from '../utils/success-message.util';

export const register = async (
  req: Request<{}, {}, { name: string; email: string; password: string }>,
  res: Response<SuccessMessage>,
  next: NextFunction,
) => {
  try {
    const { email, name, password } = req.body;
    const user = await UserService.createUser(email, name, password);
    const verifyEmailToken = await TokenService.generateVerifyEmailToken(user.transform());
    await MailService.sendVerificationEmail(email, verifyEmailToken);
    res.json(new SuccessMessage(SUCCESSFUL_REGISTR));
  } catch (e) {
    next(e);
  }
};

export const login = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response<{ userId: string; accessToken: string }>,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await AuthService.loginUserWithEmailAndPassword(email, password);
    const tokens = await TokenService.generateAuthTokens(user);
    await TokenService.saveToken(user.id, tokens.refreshToken);
    res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, {
      maxAge: COOKIE_AGE,
      httpOnly: true,
    });
    res.send({ userId: user.id, accessToken: tokens.accessToken });
  } catch (e) {
    next(e);
  }
};

export const logout = async (req: Request, res: Response<SuccessMessage>, next: NextFunction) => {
  try {
    await AuthService.logout(req.cookies[REFRESH_COOKIE_NAME]);
    res.json(new SuccessMessage(SUCCESSFUL_LOGOUT));
  } catch (e) {
    next(e);
  }
};

export const refreshTokens = async (
  req: Request,
  res: Response<{ userId: string; accessToken: string }>,
  next: NextFunction,
) => {
  try {
    const userIdAndTokens = await AuthService.refreshAuth(req.cookies[REFRESH_COOKIE_NAME]);
    res.cookie(REFRESH_COOKIE_NAME, userIdAndTokens.refreshToken, {
      maxAge: COOKIE_AGE,
      httpOnly: true,
    });
    res.json({ userId: userIdAndTokens.userId, accessToken: userIdAndTokens.accessToken });
  } catch (e) {
    next(e);
  }
};

export const verifyEmail = async (
  req: Request<{ token: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await AuthService.verifyEmail(req.params.token);
    // TODO: add success confirm link
    res.redirect(process.env.CLIENT_SUCCESS_CONFIRM_URL);
  } catch (e) {
    // TODO: add error confirm link
    res.redirect('https://google.com');
  }
};

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const a = await User.find();
    const t = await tokenModel.find();
    console.log(t);
    res.json(a);
  } catch (e) {
    next(e);
  }
};

export const rem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await User.deleteMany();
    await tokenModel.deleteMany();
    res.status(httpStatus.NO_CONTENT).send();
  } catch (e) {
    next(e);
  }
};
