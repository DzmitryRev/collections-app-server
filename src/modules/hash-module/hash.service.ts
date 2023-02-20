import bcrypt from 'bcrypt';
import { INVALID_PASSWORD } from '../../constants/errors.const';
import ApiError from '../../utils/api-error.util';
import { compareHash } from './hash.helpers';

class HashService {
  async checkPassword(correctPassword: string, checkedPassword: string) {
    const isPassEquals = await compareHash(correctPassword, checkedPassword);
    if (!isPassEquals) throw ApiError.badRequest(INVALID_PASSWORD);
  }

  async hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 3);
    return hashedPassword;
  }
}

export const HashServiceInstance = new HashService();
