import bcrypt from 'bcrypt';
import { UpdateQuery } from 'mongoose';
import {
  INVALID_LINK,
  INVALID_PASSWORD,
  USER_BLOCKED,
  USER_EXIST,
  USER_NOT_CONFIRMED,
  USER_NOT_FOUND,
} from '../../constants/errors.const';
import UserModel, { UserDtoType, UserMethodsType } from '../../models/user.model';
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
    return savedUser;
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

  async getUserById(id: string) {
    const user = await UserModel.findById(id).catch(() => {
      throw ApiError.badRequest(USER_NOT_FOUND);
    });
    if (!user) throw ApiError.badRequest(USER_NOT_FOUND);
    return user;
  }

  async findAndUpdateById(id: string, body: Partial<UserDtoType>) {
    const user = await UserModel.findByIdAndUpdate(id, body).catch(() => {
      throw ApiError.badRequest(USER_NOT_FOUND);
    });
    if (!user) throw ApiError.badRequest(USER_NOT_FOUND);
    return user;
  }

  async confirmUserEmail(id: string) {
    const user = await this.getUserById(id);
    if (user.isConfirmed) throw ApiError.badRequest(INVALID_LINK);
    user.isConfirmed = true;
    await user.save();
  }

  async updateUserById(id: string, filter: UpdateQuery<UserMethodsType>) {
    const user = await UserModel.findByIdAndUpdate(id, { ...filter }, { new: true });
    if (!user) throw ApiError.badRequest(USER_NOT_FOUND);
    return user;
  }
}

export default new UserService();
