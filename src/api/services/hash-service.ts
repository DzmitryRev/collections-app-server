import bcrypt from 'bcrypt';
import ApiError from '../../utils/api-error';

class HashService {
  async compareHash(userPassword: string, passwordFromReq: string): Promise<boolean> {
    const isPassEquals = await bcrypt.compare(passwordFromReq, userPassword);
    if (!isPassEquals) {
      throw new ApiError('Invalid password');
    }
    return isPassEquals;
  }

  async hashPassword(password: string): Promise<string> {
    const hashPassword = await bcrypt.hash(password, 5);
    return hashPassword;
  }
}

export default new HashService();
