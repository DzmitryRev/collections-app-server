import bcrypt from 'bcrypt';
import {
  INVALID_LINK,
  INVALID_PASSWORD,
  USER_BLOCKED,
  USER_EXIST,
  USER_NOT_CONFIRMED,
  USER_NOT_FOUND,
} from '../../constants/errors.const';
import UserModel, { IUser } from '../../models/user.model';
import ApiError from '../../utils/api-error.util';

class UserService {
  async createUser(email: string, name: string, hashedPassword: string) {
    const user = await UserModel.findOne({ email });
    if (user) throw ApiError.badRequest(USER_EXIST);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    return savedUser.transform();
  }

  async getUserProfile(userId: string) {
    const user = await UserModel.getUserById(userId);
    if (!user) throw ApiError.badRequest(USER_NOT_FOUND);
    return user.transform();
  }

  async checkAccessToLogin(email: string) {
    const user = await UserModel.findOne({ email });
    if (!user) throw ApiError.badRequest(USER_NOT_FOUND);
    if (user.isBlocked) throw ApiError.badRequest(USER_BLOCKED);
    if (!user.isConfirmed) throw ApiError.badRequest(USER_NOT_CONFIRMED);
    return user;
  }

  async comparePassword(correctPassword: string, password: string) {
    const isPassEquals = await bcrypt.compare(password, correctPassword);
    if (!isPassEquals) throw ApiError.badRequest(INVALID_PASSWORD);
  }

  async confirmUserEmail(userId: string) {
    const user = await UserModel.getUserById(userId);
    if (!user) throw ApiError.badRequest(USER_NOT_FOUND);
    if (user.isConfirmed) throw ApiError.badRequest(INVALID_LINK);
    user.isConfirmed = true;
    await user.save();
    return user.transform();
  }

  async updateUser(userId: string, body: Partial<IUser>) {
    const user = await UserModel.getUserByIdAndUpdate(userId, body);
    if (!user) throw ApiError.badRequest(USER_NOT_FOUND);
    return user.transform();
  }
}

export default new UserService();
