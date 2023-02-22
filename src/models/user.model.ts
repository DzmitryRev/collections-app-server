import {
  Schema, model, Model, Document,
} from 'mongoose';

export type UserType = {
  avatar: string;
  name: string;
  email: string;
  password: string;
  about: string;
  isConfirmed: boolean;
  isBlocked: boolean;
  isAdmin: boolean;
};

export type UserDtoType = { id: string } & Pick<
UserType,
'name' | 'about' | 'avatar' | 'email' | 'isAdmin' | 'isBlocked' | 'isConfirmed'
>;

export type UserMethodsType = {
  transform(): UserDtoType;
} & UserType &
Document;

export type UserModelType = Model<UserMethodsType>;

const userSchema = new Schema<UserType, UserModelType, UserMethodsType>({
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

userSchema.methods.transform = function transform() {
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
};

const user = model<UserType, UserModelType>('User', userSchema);

export default user;
