/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  NextFunction, Request, Response, urlencoded,
} from 'express';
import httpStatus from 'http-status';
import { COOKIE_AGE, REFRESH_COOKIE_NAME } from '../constants/cookie.const';
import { SUCCESSFUL_LOGOUT, SUCCESSFUL_REGISTR } from '../constants/success-messages.const';
import tokenModel from '../models/token.model';
import User, { UserDtoType, UserModelType } from '../models/user.model';
import AuthService from '../services/auth.service';
import HashService from '../services/hash.service';
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
  res: Response<{ userId: UserDtoType; accessToken: string }>,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.checkAccessToLogin(email);
    await HashService.checkPassword(user.password, password);
    const tokens = TokenService.generateAuthTokens(user.transform());
    await TokenService.saveToken(user.id, tokens.refreshToken);
    res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, {
      maxAge: COOKIE_AGE,
      httpOnly: true,
    });
    res.send({ userId: user.transform(), accessToken: tokens.accessToken });
  } catch (e) {
    next(e);
  }
};

export const logout = async (req: Request, res: Response<SuccessMessage>, next: NextFunction) => {
  try {
    await AuthService.logout(req.cookies[REFRESH_COOKIE_NAME]);
    res.clearCookie(REFRESH_COOKIE_NAME);
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
    await TokenService.saveToken(userIdAndTokens.userId, userIdAndTokens.refreshToken);
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
    res.redirect('http://localhost:5173/email-confirmed?access=true');
  } catch (e) {
    res.redirect('http://localhost:5173/confirmation-error?access=true');
  }
};

export const checkAccessToChangingPassword = async (
  req: Request<{}, {}, { email: string }>,
  res: Response<{ userId: string; accessToken: string }>,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    // 1. Check user exist;
    // 2. Generate token
    // 3. Send main with confirm changing
    // const user = checkUser;
    // const verifyEmailToken = await TokenService.generateVerifyEmailToken(user.transform());
    // await MailService.sendAccessToChangingPasswordEmail(email, verifyEmailToken);
    // res.json(new SuccessMessage(SUCCESSFUL_REGISTR));
  } catch (e) {
    next(e);
  }
};

export const sendNewPassword = async (
  req: Request<{ token: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Verify token from link;
    // 2. Send password to email with secure link;
    // 3. Redirect to password sended page
    // res.redirect('http://localhost:5173/password-sended?access=true');
  } catch (e) {
    // res.redirect('http://localhost:5173/confirmation-error?access=true');
  }
};

export const ConfirmNewPassword = async (
  req: Request<{ token: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Verify token from link;
    // 2. Send password to email with secure link;
    // 3. Redirect to password changed page
    // res.redirect('http://localhost:5173/password-changed?access=true');
  } catch (e) {
    // res.redirect('http://localhost:5173/confirmation-error?access=true');
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
