import User from '../models/user.model';
import ApiError from '../utils/auth-error.util';
import HashService from './hash.service';
import { USER_EXIST } from '../constants/errors.const';

class UserService {
  async createUser(email: string, name: string, password: string) {
    const userExist = await User.findOne({ email });
    if (userExist) throw ApiError.badRequest(USER_EXIST);
    const hashedPassword = await HashService.hashPassword(password);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    return savedUser;
  }

  async getUserByEmail(email: string) {
    return User.findOne({ email });
  }

  async getUserById(id: string) {
    return User.findById(id);
  }
}

export default new UserService();
