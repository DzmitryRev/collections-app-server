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
  getNewCollections,
  getUserCollections,
  searchCollectionItems,
  //   searchCollectionItems,
  toggleLikeCollectionItem,
  updateCollection,
  updateCollectionItem,
} from '../controllers/collections.controller';
import { adminOrOwnerMiddleware } from '../middlewares/admin-or-owner.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  validateCreateCollectionBody,
  validateUpdateCollectionBody,
} from '../validation/collection.validation';

const collectionRouter = Router();

collectionRouter.get('/collections-themes', getAvailableThemes);

collectionRouter.get('/user/:userId/collections', getUserCollections);
collectionRouter.get('/collections/new', getNewCollections);
collectionRouter.get('/collections/:collectionId', getCollection);
collectionRouter.post(
  '/user/:userId/collections',
  authMiddleware,
  adminOrOwnerMiddleware,
  validateCreateCollectionBody,
  addCollection,
);
collectionRouter.put(
  '/user/:userId/collections/:collectionId',
  authMiddleware,
  adminOrOwnerMiddleware,
  validateUpdateCollectionBody,
  updateCollection,
);
collectionRouter.delete(
  '/user/:userId/collections/delete',
  authMiddleware,
  adminOrOwnerMiddleware,
  deleteCollections,
);

collectionRouter.get('/collections/:collectionId/items', getCollectionItems);
collectionRouter.get('/collection/:collectionItemId', getCollectionItem);
collectionRouter.get('/search-items', searchCollectionItems);

collectionRouter.post(
  '/user/:userId/collections/:collectionId',
  authMiddleware,
  adminOrOwnerMiddleware,
  addCollectionItem,
);

collectionRouter.put(
  '/user/:userId/collection/update/:collectionItemId',
  authMiddleware,
  adminOrOwnerMiddleware,
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
  adminOrOwnerMiddleware,
  deleteCollectionItems,
);

export default collectionRouter;
