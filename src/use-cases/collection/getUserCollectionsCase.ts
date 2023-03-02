import { ICollection } from '../../models/collection.model';
import collectionService from '../../services/collection-service/collection.service';

export async function getUserCollectionsCase(userId: string, page: number, itemsPerPage: number) {
  const collections = await collectionService.getUserCollections(userId, page, itemsPerPage);
  const total = await collectionService.countUserCollections(userId);
  return { collections, total };
}
