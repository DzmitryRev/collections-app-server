import { Schema, model, Types } from 'mongoose';

export type TokenType = {
  user: Types.ObjectId;
  refreshToken: string;
};

const tokenSchema = new Schema<TokenType>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
});

export default model('Token', tokenSchema);
