/* eslint-disable import/no-named-as-default */
/* eslint-disable no-underscore-dangle */
import CollectionModel, { CollectionDtoType, ICollection } from '../../models/collection.model';
import CollectionItemModel, { CollectionItemBodyType } from '../../models/collection-item.model';
import ApiError from '../../utils/api-error.util';
import CommentModel, { CommentDtoType } from '../../models/comment.model';
import { ELEMENT_NOT_FOUND } from '../../constants/errors.const';

export type AddCollectionBodyType = Pick<ICollection, 'name' | 'theme'>;

export type CommentBodyType = {
  from: string;
  comment: string;
};

class CollectionService {
  async createBodyWithItemFields(collectionId: string, body: CollectionItemBodyType) {
    const collection = await CollectionModel.getCollectionById(collectionId);
    if (!collection) throw ApiError.badRequest(ELEMENT_NOT_FOUND);
    const availableItems = [...collection.requiredFields, ...collection.customFields];
    const resultBody: { [key: string]: unknown } = {};
    availableItems.forEach((item) => {
      if (body[item.name]) {
        resultBody[item.name] = body[item.name];
        return item;
      }
      return item;
    });
    return { body, user: collection.user };
  }

  async getUserCollections(userId: string, page: number, itemsPerPage: number) {
    const collections = await CollectionModel.find(
      { user: userId },
      {
        description: 0,
        user: 0,
        requiredFields: 0,
        customFields: 0,
      },
      { skip: (page - 1) * itemsPerPage, limit: itemsPerPage },
    );
    return collections.map((item) => item.toJSON());
  }

  async countUserCollections(userId: string) {
    const collectionsCount = await CollectionModel.countDocuments({ user: userId });
    return collectionsCount;
  }

  async createCollection(userId: string, body: AddCollectionBodyType) {
    const collection = new CollectionModel({
      user: userId,
      ...body,
    });
    const savedCollection = await collection.save();
    return savedCollection.toJSON();
  }

  async deleteCollections(collections: string[]) {
    const deletedCollections = await CollectionModel.deleteMany({ _id: { $in: collections } });
    return deletedCollections;
  }

  async updateCollection(collectionId: string, body: Partial<CollectionDtoType>) {
    const collection = await CollectionModel.getCollectionByIdAndUpdate(collectionId, body);
    if (!collection) throw ApiError.badRequest(ELEMENT_NOT_FOUND);
    return collection.toJSON();
  }

  async getCollection(collectionId: string) {
    const collection = await CollectionModel.getCollectionById(collectionId);
    if (!collection) throw ApiError.badRequest('collection_not_found');
    return collection.toJSON();
  }

  async getCollectionItems(collectionId: string) {
    const collectionItems = await CollectionItemModel.find({ collectionId });
    return collectionItems.map((item) => item.toJSON());
  }

  //   async searchCollectionItems(value: string) {
  //     const collectionItems = await CollectionItemModel.find({
  //       $text: { $search: value },
  //     });
  //     return collectionItems.map((item) => item.toJSON());
  //   }

  async addCollectionItem(
    collectionId: string,
    body: {
      [key: string]: any;
    },
  ) {
    const resultBody = await this.createBodyWithItemFields(collectionId, body);
    const collectionItem = new CollectionItemModel({
      collectionId,
      ...resultBody,
    });
    const savedCollectionItem = await collectionItem.save();
    return savedCollectionItem.toJSON();
  }

  async deleteCollectionItems(collectionItems: string[]) {
    const deletedItems = await CollectionItemModel.deleteMany({ _id: { $in: collectionItems } });
    return deletedItems;
  }

  async updateCollectionItem(
    collectionItemId: string,
    body: {
      [key: string]: any;
    },
  ) {
    const item = await CollectionItemModel.findById(collectionItemId);
    if (!item) throw ApiError.badRequest(ELEMENT_NOT_FOUND);
    const resultBody = await this.createBodyWithItemFields(String(item.collectionId), body);
    const collectionItem = await CollectionItemModel.getCollectionItemByIdAndUpdate(
      collectionItemId,
      resultBody.body,
    );
    if (!collectionItem) throw ApiError.badRequest(ELEMENT_NOT_FOUND);
    return collectionItem.toJSON();
  }

  async getCollectionItem(collectionItemId: string) {
    const collectionItem = await CollectionItemModel.getCollectionItemById(collectionItemId);
    if (!collectionItem) throw ApiError.badRequest(ELEMENT_NOT_FOUND);
    return collectionItem.toJSON();
  }

  async toggleLikeCollectionItem(collectionItemId: string, userId: string) {
    const collectionItem = await CollectionItemModel.findById(collectionItemId);
    if (!collectionItem) throw ApiError.badRequest(ELEMENT_NOT_FOUND);
    if (collectionItem.likes.includes(userId)) {
      const unliked = await collectionItem.removeLike(userId);
      return unliked?.toJSON();
    }
    const liked = await collectionItem.addLike(userId);
    return liked?.toJSON();
  }
}

export default new CollectionService();
