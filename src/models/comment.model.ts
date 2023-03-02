/* eslint-disable no-underscore-dangle */
import {
  Schema, model, Types, Model,
} from 'mongoose';

export interface IComment {
  collectionId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  userAvatar: string;
  comment: string;
}

export type CommentDtoType = {
  userId: Types.ObjectId;
  userName: string;
  userAvatar: string;
  comment: string;
};

interface ICommentMethods {
  transform(): CommentDtoType;
}

interface CommentModel extends Model<IComment, {}, ICommentMethods> {
  // statics
}

const commentSchema = new Schema<IComment, CommentModel, ICommentMethods>({
  collectionId: { type: Schema.Types.ObjectId, ref: 'Collection' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, required: true },
  userAvatar: { type: String, required: true },
  comment: { type: String, required: true },
});

commentSchema.method('transform', function transform() {
  return {
    userId: this.user,
    comment: this.comment,
    userName: this.userName,
    userAvatar: this.userAvatar,
  };
});

export default model<IComment, CommentModel>('Comment', commentSchema);
