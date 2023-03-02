import { Router } from 'express';
import {
  addCollection,
  addCollectionItem,
  deleteCollectionItems,
  deleteCollections,
  getAvailableThemes,
  getCollection,
  getCollectionItem,
  getCollectionItems,
  getUserCollections,
  searchCollectionItems,
  toggleLikeCollectionItem,
  updateCollection,
  updateCollectionItem,
} from '../controllers/collections.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { ownerMiddleware } from '../middlewares/owner.middleware';
import {
  validateCreateCollectionBody,
  validateUpdateCollectionBody,
} from '../validation/collection.validation';

const collectionRouter = Router();

collectionRouter.get('/collections-themes', getAvailableThemes);

collectionRouter.get('/user/:userId/collections', getUserCollections);
collectionRouter.get('/collections/:collectionId', getCollection);
collectionRouter.post(
  '/user/:userId/collections',
  authMiddleware,
  ownerMiddleware,
  validateCreateCollectionBody,
  addCollection,
);
collectionRouter.put(
  '/user/:userId/collections/:collectionId',
  authMiddleware,
  ownerMiddleware,
  validateUpdateCollectionBody,
  updateCollection,
);
collectionRouter.delete(
  '/user/:userId/collections/delete',
  authMiddleware,
  ownerMiddleware,
  deleteCollections,
);

collectionRouter.get('/collections/:collectionId/items', getCollectionItems);
collectionRouter.get('/collection/:collectionItemId', getCollectionItem);
collectionRouter.get('/search-items', searchCollectionItems);

collectionRouter.post(
  '/user/:userId/collections/:collectionId',
  authMiddleware,
  ownerMiddleware,
  addCollectionItem,
);

collectionRouter.put(
  '/user/:userId/collection/update/:collectionItemId',
  authMiddleware,
  ownerMiddleware,
  updateCollectionItem,
);

collectionRouter.put(
  '/collection/:collectionItemId/like',
  authMiddleware,
  toggleLikeCollectionItem,
);

collectionRouter.delete(
  '/user/:userId/collection-items/delete',
  authMiddleware,
  ownerMiddleware,
  deleteCollectionItems,
);

export default collectionRouter;
