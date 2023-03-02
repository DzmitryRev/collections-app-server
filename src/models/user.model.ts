import {
  Schema, model, Model, HydratedDocument,
} from 'mongoose';
import { INVALID_SCHEMA_ID } from '../constants/errors.const';
import ApiError from '../utils/api-error.util';

export interface IUser {
  avatar: string;
  name: string;
  email: string;
  password: string;
  about: string;
  isConfirmed: boolean;
  isBlocked: boolean;
  isAdmin: boolean;
}

export type UserDtoType = { id: string } & Pick<
IUser,
'name' | 'about' | 'avatar' | 'email' | 'isAdmin' | 'isBlocked' | 'isConfirmed'
>;

interface IUserMethods {
  transform(): UserDtoType;
}

type StaticsReturnType = Promise<HydratedDocument<IUser, IUserMethods> | null>;

interface UserModel extends Model<IUser, {}, IUserMethods> {
  getUserById(userId: string): StaticsReturnType;
  getUserByIdAndUpdate(userId: string, body: Partial<UserDtoType>): StaticsReturnType;
}

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  about: { type: String, default: '' },
  isConfirmed: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
});

userSchema.method('transform', function transform() {
  const userDto: UserDtoType = {
    id: this.id as string,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    about: this.about,
    isConfirmed: this.isConfirmed,
    isBlocked: this.isBlocked,
    isAdmin: this.isAdmin,
  };
  return userDto;
});

userSchema.static('getUserById', async function getUserById(userId: string) {
  return this.findById(userId).catch(() => {
    throw ApiError.badRequest(INVALID_SCHEMA_ID);
  });
});

userSchema.static(
  'getUserByIdAndUpdate',
  async function getUserByIdAndUpdate(userId: string, body: Partial<UserDtoType>) {
    return this.findByIdAndUpdate(userId, body).catch(() => {
      throw ApiError.badRequest(INVALID_SCHEMA_ID);
    });
  },
);

export default model<IUser, UserModel>('User', userSchema);
