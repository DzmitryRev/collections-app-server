import {
  Schema, model, type Model, type Document,
} from 'mongoose';
import hashService from '../services/hash-service';

export type UserType = {
  photo: string;
  name: string;
  email: string;
  password: string;
  about: string;
  isConfirmed: boolean;
  activationLink: string;
  isBlocked: boolean;
  isAdmin: boolean;
};

export type UserDtoType = { id: string } & Pick<
UserType,
'name' | 'about' | 'photo' | 'email' | 'isAdmin' | 'isBlocked' | 'isConfirmed'
>;

type UserMethodsType = {
  transform(): UserDtoType;
} & UserType &
Document;

type UserModelType = Model<UserMethodsType>;

const userSchema = new Schema<UserType, UserModelType, UserMethodsType>({
  email: {
    type: String, unique: true, required: true, trim: true,
  },
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  photo: { type: String, default: null },
  about: { type: String, default: '' },
  isConfirmed: { type: Boolean, default: false },
  activationLink: { type: String },
  isBlocked: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
});

userSchema.pre('save', async function save(next) {
  const hashedPassword = await hashService.hashPassword(this.password);
  this.password = hashedPassword;
  next();
});

userSchema.methods.transform = function transform() {
  const userDto: UserDtoType = {
    id: this.id as string,
    name: this.name,
    email: this.email,
    photo: this.photo,
    about: this.about,
    isConfirmed: this.isConfirmed,
    isBlocked: this.isBlocked,
    isAdmin: this.isAdmin,
  };
  return userDto;
};

const user = model<UserType, UserModelType>('User', userSchema);

export default user;
