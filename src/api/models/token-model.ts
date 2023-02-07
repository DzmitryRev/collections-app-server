import { Schema, model } from 'mongoose';
import { type UserType } from './user-model';

export type TokenType = {
  user: UserType;
  refreshToken: string;
};

const tokenSchema = new Schema<TokenType>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
});

export default model('Token', tokenSchema);
