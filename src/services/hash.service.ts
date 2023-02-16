import bcrypt from 'bcrypt';
import { INVALID_PASSWORD } from '../constants/errors.const';
import ApiError from '../utils/auth-error.util';

class HashService {
  async compareHash(userPassword: string, passwordFromReq: string): Promise<boolean> {
    const isPassEquals = await bcrypt.compare(passwordFromReq, userPassword);
    return isPassEquals;
  }

  async hashPassword(password: string): Promise<string> {
    const hashPassword = await bcrypt.hash(password, 3);
    return hashPassword;
  }

  async checkPassword(correctPassword: string, checkedPassword: string) {
    const isPassEquals = await this.compareHash(correctPassword, checkedPassword);
    if (!isPassEquals) throw ApiError.badRequest(INVALID_PASSWORD);
  }
}

export default new HashService();
