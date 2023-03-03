/* eslint-disable import/no-named-as-default */
import CollectionModel from '../../models/collection.model';

export async function getNewCollectionsCase() {
  const items = await CollectionModel.find(
    {},
    {
      description: 0,
      user: 0,
      requiredFields: 0,
      customFields: 0,
    },
    { limit: 10 },
  ).sort({ creationDate: -1 });
  return items.map((item) => item.toJSON());
}
