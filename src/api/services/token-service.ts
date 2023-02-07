import jwt from 'jsonwebtoken';
import Token from '../models/token-model';
import { type UserDtoType } from '../models/user-model';

class TokenService {
  generateTokens(payload: UserDtoType) {
    const accessToken = jwt.sign({ payload }, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign({ payload }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
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

  async removeToken(refreshToken: string) {
    await Token.deleteOne({ refreshToken });
  }

  async findToken(refreshToken: string) {
    const tokenData = await Token.findOne({ refreshToken });
    return tokenData;
  }
}

export default new TokenService();
