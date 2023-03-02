import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { USER_ALREADY_LOGGED_OUT, UNAUTHORIZED } from '../constants/errors.const';
import TokenModel from '../models/token.model';

import { UserDtoType } from '../models/user.model';
import ApiError from '../utils/api-error.util';

class TokenService {
  async saveRefreshToken(userId: string, refreshToken: string) {
    const tokenData = await TokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await TokenModel.create({ user: userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken: string) {
    const refreshTokenDoc = await TokenModel.findOneAndDelete({ refreshToken });
    if (!refreshTokenDoc) {
      throw new ApiError(USER_ALREADY_LOGGED_OUT, httpStatus.NOT_FOUND);
    }
  }

  async removeTokenByUserId(userId: string) {
    const refreshTokenDoc = await TokenModel.findOneAndDelete({
      user: userId,
    });
    if (!refreshTokenDoc) {
      throw new ApiError(USER_ALREADY_LOGGED_OUT, httpStatus.NOT_FOUND);
    }
  }

  async getToken(token: string) {
    const tokenInDb = await TokenModel.findOne({ refreshToken: token });
    if (!tokenInDb) throw new ApiError(UNAUTHORIZED, httpStatus.UNAUTHORIZED);
    return tokenInDb;
  }

  validateToken(token: string, secret: string) {
    const tokenDoc = jwt.verify(token, secret);
    if (!tokenDoc) throw new ApiError(UNAUTHORIZED, httpStatus.UNAUTHORIZED);
    return tokenDoc as JwtPayload;
  }

  generatePasswordToken(payload: { user: UserDtoType; newPassword: string }) {
    const newPasswordToken = jwt.sign({ payload }, process.env.JWT_PASSWORD_SECRET, {
      expiresIn: '15m',
    });
    return newPasswordToken;
  }

  generateVerifyEmailToken(payload: UserDtoType) {
    const verifyEmailToken = jwt.sign({ payload }, process.env.JWT_EMAIL_SECRET, {
      expiresIn: '15m',
    });
    return verifyEmailToken;
  }

  generateAuthTokens(payload: UserDtoType) {
    const accessToken = jwt.sign({ payload }, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign({ payload }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}

export default new TokenService();
