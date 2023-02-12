import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserDtoType } from '../models/user.model';
import Token from '../models/token.model';
import ApiError from '../utils/auth-error.util';

class TokenService {
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

  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await Token.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = await Token.create({ user: userId, refreshToken });
    return token;
  }

  validateToken(token: string, secret: string) {
    try {
      const userData = jwt.verify(token, secret);
      return userData as JwtPayload;
    } catch (e) {
      return null;
    }
  }

  async generateVerifyEmailToken(payload: UserDtoType) {
    const verifyEmailToken = jwt.sign({ payload }, process.env.JWT_EMAIL_SECRET, {
      expiresIn: '15m',
    });
    return verifyEmailToken;
  }

  async removeToken(refreshToken: string) {
    const refreshTokenDoc = await Token.findOneAndDelete({ refreshToken });
    if (!refreshTokenDoc) {
      throw new ApiError('Not found', httpStatus.NOT_FOUND);
    }
  }
}

export default new TokenService();
