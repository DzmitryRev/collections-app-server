import { NextFunction, Request, Response } from 'express';
import { FlattenMaps, LeanDocument } from 'mongoose';
import { ICollectionItem } from '../models/collection-item.model';
import { AVAILABLE_THEMES, CollectionDtoType, ICollection } from '../models/collection.model';
import collectionService, {
  AddCollectionBodyType,
} from '../services/collection-service/collection.service';
import { getUserCollectionsCase } from '../use-cases/collection';

type UserCollectionsResType = {
  collections: Pick<FlattenMaps<LeanDocument<ICollection>>, 'name' | 'photo' | 'theme'>[];
  total: number;
};

type CollectionResType = FlattenMaps<LeanDocument<ICollection>>;

export const getAvailableThemes = async (
  req: Request,
  res: Response<{ themes: string[] }>,
  next: NextFunction,
) => {
  try {
    res.json({ themes: AVAILABLE_THEMES });
  } catch (e) {
    next(e);
  }
};

export const getUserCollections = async (
  req: Request<{ userId: string }, {}, {}, { page: number; itemsPerPage: number }>,
  res: Response<UserCollectionsResType>,
  next: NextFunction,
) => {
  try {
    const { page, itemsPerPage } = req.query;
    const { userId } = req.params;
    const userCollections = await getUserCollectionsCase(userId, page, itemsPerPage);
    res.json(userCollections);
  } catch (e) {
    next(e);
  }
};

export const getCollection = async (
  req: Request<{ collectionId: string }>,
  res: Response<CollectionResType>,
  next: NextFunction,
) => {
  try {
    const { collectionId } = req.params;
    const collection = await collectionService.getCollection(collectionId);
    res.json(collection);
  } catch (e) {
    next(e);
  }
};

export const getCollectionItems = async (
  req: Request<{ collectionId: string }>,
  res: Response<{ items: ICollectionItem[] }>,
  next: NextFunction,
) => {
  try {
    const { collectionId } = req.params;
    const collectionItems = await collectionService.getCollectionItems(collectionId);
    res.json({ items: collectionItems });
  } catch (e) {
    next(e);
  }
};

export const searchCollectionItems = async (
  req: Request,
  res: Response<{ items: ICollectionItem[] }>,
  next: NextFunction,
) => {
  try {
    const collectionItems = await collectionService.searchCollectionItems('latte');
    res.json({ items: collectionItems });
  } catch (e) {
    next(e);
  }
};

export const getCollectionItem = async (
  req: Request<{ collectionItemId: string }>,
  res: Response<ICollectionItem>,
  next: NextFunction,
) => {
  try {
    const { collectionItemId } = req.params;
    const collectionItem = await collectionService.getCollectionItem(collectionItemId);
    res.json(collectionItem);
  } catch (e) {
    next(e);
  }
};

export const addCollection = async (
  req: Request<{ userId: string }, {}, AddCollectionBodyType>,
  res: Response<CollectionResType>,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const collection = await collectionService.createCollection(userId, req.body);
    res.json(collection);
  } catch (e) {
    next(e);
  }
};

export const addCollectionItem = async (
  req: Request<{ collectionId: string }, {}, { [key: string]: any }>,
  res: Response<ICollectionItem>,
  next: NextFunction,
) => {
  try {
    const { collectionId } = req.params;
    const newCollectionItem = await collectionService.addCollectionItem(collectionId, req.body);
    res.json(newCollectionItem);
  } catch (e) {
    next(e);
  }
};

export const updateCollection = async (
  req: Request<{ collectionId: string }, {}, Partial<CollectionDtoType>>,
  res: Response<CollectionResType>,
  next: NextFunction,
) => {
  try {
    const { collectionId } = req.params;
    const collection = await collectionService.updateCollection(collectionId, req.body);
    res.json(collection);
  } catch (e) {
    next(e);
  }
};

export const updateCollectionItem = async (
  req: Request<{ collectionItemId: string }, {}, { [key: string]: any }>,
  res: Response<ICollectionItem>,
  next: NextFunction,
) => {
  try {
    const { collectionItemId } = req.params;
    const collectionItem = await collectionService.updateCollectionItem(collectionItemId, req.body);
    res.json(collectionItem);
  } catch (e) {
    next(e);
  }
};

export const deleteCollections = async (
  req: Request<{}, {}, { collections: string[] }>,
  res: Response<any>,
  next: NextFunction,
) => {
  try {
    const deletedCollections = await collectionService.deleteCollections(req.body.collections);
    res.json(deletedCollections);
  } catch (e) {
    next(e);
  }
};

export const deleteCollectionItems = async (
  req: Request<{}, {}, { collectionItems: string[] }>,
  res: Response<any>,
  next: NextFunction,
) => {
  try {
    const deletedCollections = await collectionService.deleteCollectionItems(
      req.body.collectionItems,
    );
    res.json(deletedCollections);
  } catch (e) {
    next(e);
  }
};
export const toggleLikeCollectionItem = async (
  req: Request<{ collectionItemId: string }>,
  res: Response<ICollectionItem>,
  next: NextFunction,
) => {
  try {
    const likedItem = await collectionService.toggleLikeCollectionItem(
      req.params.collectionItemId,
      req.user?.id || '',
    );
    res.json(likedItem);
  } catch (e) {
    next(e);
  }
};
