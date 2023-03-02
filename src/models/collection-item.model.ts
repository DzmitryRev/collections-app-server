/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import {
  HydratedDocument, Model, model, Schema, Types,
} from 'mongoose';
import { INVALID_SCHEMA_ID } from '../constants/errors.const';
import ApiError from '../utils/api-error.util';
import { StringField, TagsField } from './collection.model';

type FieldWithValue<T, K> = T & { value: K };

export interface ICollectionItem {
  collectionId: Types.ObjectId;
  user: Types.ObjectId;
  likes: string[];
  body: {
    name: FieldWithValue<StringField, string>;
    tags: FieldWithValue<TagsField, string[]>;
  };
}

export type CollectionItemBodyType = Omit<Partial<ICollectionItem>, 'likes'> & {
  [key: string]: unknown;
};

type StaticsReturnType = Promise<HydratedDocument<ICollectionItem, ICollectionItemMethods> | null>;

interface ICollectionItemMethods {
  removeLike(userId: string): StaticsReturnType;
  addLike(userId: string): StaticsReturnType;
}

interface CollectionItemModel extends Model<ICollectionItem, {}, ICollectionItemMethods> {
  getCollectionItemById(collectionItemId: string): StaticsReturnType;
  getCollectionItemByIdAndUpdate(
    collectionItemId: string,
    body: Partial<ICollectionItem>
  ): StaticsReturnType;
}

const collectionItemSchema = new Schema<
ICollectionItem,
CollectionItemModel,
ICollectionItemMethods
>(
  {
    collectionId: { type: Schema.Types.ObjectId, ref: 'Collection' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: String, default: [] }],
    body: {
      name: { type: Object },
      tags: { type: Object },
    },
  },
  {
    strict: false,
  },
);

collectionItemSchema.index({ '$**': 'text' });

collectionItemSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

collectionItemSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret, options) {
    delete ret._id;
    delete ret.__v;
  },
});

collectionItemSchema.method('removeLike', async function removeLike(userId: string) {
  this.likes = this.likes.filter((like: string) => like !== userId);
  const updatedCollectionItem = await this.save();
  return updatedCollectionItem;
});

collectionItemSchema.method('addLike', async function removeLike(userId: string) {
  this.likes.push(userId);
  const updatedCollectionItem = await this.save();
  return updatedCollectionItem;
});

collectionItemSchema.static(
  'getCollectionItemById',
  async function getCollectionItemById(collectionItemId: string) {
    return this.findById(collectionItemId).catch(() => {
      throw ApiError.badRequest(INVALID_SCHEMA_ID);
    });
  },
);

collectionItemSchema.static(
  'getCollectionItemByIdAndUpdate',
  async function getCollectionItemByIdAndUpdate(
    collectionItemId: string,
    body: CollectionItemBodyType,
  ) {
    return this.findByIdAndUpdate(collectionItemId, { body: { ...body } }).catch(() => {
      throw ApiError.badRequest(INVALID_SCHEMA_ID);
    });
  },
);

export default model<ICollectionItem, CollectionItemModel>('CollectionItem', collectionItemSchema);
