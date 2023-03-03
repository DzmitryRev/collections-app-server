/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import {
  Schema, model, Types, Model, HydratedDocument,
} from 'mongoose';
import { INVALID_SCHEMA_ID } from '../constants/errors.const';
import ApiError from '../utils/api-error.util';

export const AVAILABLE_THEMES = ['books', 'movies', 'sneakers'];

export type AvailableCollectionsThemes = 'books' | 'movies' | 'sneakers';

type FieldTypes = 'string' | 'text' | 'number' | 'checkbox' | 'date' | 'tags';

type CollectionFieldType<K extends FieldTypes> = {
  name: string;
  type: K;
};

type FieldVariants = {
  variants?: string[];
};

export type StringField = CollectionFieldType<'string' | 'text'> & FieldVariants;
export type NumberField = CollectionFieldType<'number'> & FieldVariants;
export type TagsField = CollectionFieldType<'tags'> & FieldVariants;
export type BooleanField = CollectionFieldType<'checkbox'>;
export type DateField = CollectionFieldType<'date'>;

export type AnyFieldType = StringField | NumberField | TagsField | BooleanField | DateField;

export interface ICollection {
  user: Types.ObjectId;
  name: string;
  description: string;
  theme: AvailableCollectionsThemes;
  photo: string;
  creationDate: String;
  requiredFields: AnyFieldType[];
  customFields: AnyFieldType[];
}

export type CollectionDtoType = {
  id: string;
  name: string;
  description: string;
  theme: AvailableCollectionsThemes;
  photo: string;
  creationDate: String;
  requiredFields: AnyFieldType[];
  customFields: AnyFieldType[];
};

interface ICollectionMethods {}

const REQUIRED_FIELDS: AnyFieldType[] = [
  {
    name: 'name',
    type: 'string',
  },
  {
    name: 'tags',
    type: 'tags',
  },
];

type StaticsReturnType = Promise<HydratedDocument<ICollection, ICollectionMethods> | null>;

export interface CollectionModel extends Model<ICollection, {}, ICollectionMethods> {
  getCollectionById(collectionId: string): StaticsReturnType;
  getCollectionByIdAndUpdate(collectionId: string, body: Partial<ICollection>): StaticsReturnType;
}

const collectionSchema = new Schema<ICollection, CollectionModel, ICollectionMethods>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  theme: { type: String, required: true },
  description: { type: String, default: '' },
  photo: { type: String, default: '' },
  requiredFields: { type: [Object], default: REQUIRED_FIELDS },
  customFields: { type: [Object], default: [] },
  creationDate: { type: String, default: new Date().toLocaleDateString() },
});

collectionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

collectionSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret, options) {
    delete ret._id;
    delete ret.__v;
  },
});

collectionSchema.static(
  'getCollectionById',
  async function getCollectionById(collectionId: string) {
    return this.findById(collectionId).catch(() => {
      throw ApiError.badRequest(INVALID_SCHEMA_ID);
    });
  },
);

collectionSchema.static(
  'getCollectionByIdAndUpdate',
  async function getCollectionByIdAndUpdate(collectionId: string, body: Partial<ICollection>) {
    return this.findByIdAndUpdate(collectionId, body).catch(() => {
      throw ApiError.badRequest(INVALID_SCHEMA_ID);
    });
  },
);

export default model<ICollection, CollectionModel>('Collection', collectionSchema);
