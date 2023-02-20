import UserModel from '../../models/user.model';
import ApiError from '../../utils/api-error.util';
import {
  INVALID_LINK,
  USER_BLOCKED,
  USER_EXIST,
  USER_NOT_CONFIRMED,
  USER_NOT_FOUND,
} from '../../constants/errors.const';
import { getUserByEmail, getUserById } from './user.helpers';

class UserService {
  async checkUserExistByEmail(email: string) {
    const user = await getUserByEmail(email);
    if (!user) throw ApiError.badRequest(USER_NOT_FOUND);
    return user;
  }

  async checkUserNotExistByEmail(email: string) {
    const user = await getUserByEmail(email);
    if (user) throw ApiError.badRequest(USER_EXIST);
  }

  async createUser(email: string, name: string, hashedPassword: string) {
    await this.checkUserNotExistByEmail(email);
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    return savedUser;
  }

  async checkAccessToLogin(email: string) {
    const user = await this.checkUserExistByEmail(email);
    if (user.isBlocked) throw ApiError.badRequest(USER_BLOCKED);
    if (!user.isConfirmed) throw ApiError.badRequest(USER_NOT_CONFIRMED);
    return user;
  }

  async checkUserInDbById(id: string) {
    const user = await getUserById(id);
    if (!user) throw ApiError.badRequest(USER_NOT_FOUND);
    return user;
  }

  async confirmUserEmail(id: string) {
    const user = await getUserById(id);
    if (!user || user.isConfirmed) throw ApiError.badRequest(INVALID_LINK);
    user.isConfirmed = true;
    await user.save();
  }

  async changeUserPassword(id: string, newPassword: string) {
    const user = await getUserById(id);
    if (!user) throw ApiError.badRequest(INVALID_LINK);
    user.password = newPassword;
    await user.save();
  }
}

export const UserServiceInstance = new UserService();
