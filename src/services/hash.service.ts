import bcrypt from 'bcrypt';

class HashService {
  async compareHash(userPassword: string, passwordFromReq: string): Promise<boolean> {
    const isPassEquals = await bcrypt.compare(passwordFromReq, userPassword);
    return isPassEquals;
  }

  async hashPassword(password: string): Promise<string> {
    const hashPassword = await bcrypt.hash(password, 3);
    return hashPassword;
  }
}

export default new HashService();
