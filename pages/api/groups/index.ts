import dbConnect from '@/utils/db-connect';
import Group from '@/models/group.model';
import { NextApiRequest, NextApiResponse } from 'next';
import { GroupDocument } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET': // Get all groups
      Group.find()
        .collation({ locale: 'en', strength: 2 })
        .sort({ name: 1 })
        .then((groups) => res.json(groups))
        .catch((err) => res.status(400).json('Error [Get All Groups]: ' + err));
      break;

    case 'POST': // Add new group
      const name = req.body.name;
      const code = req.body.code;
      const description = req.body.description;
      const ownerId = req.body.ownerId;

      const newGroup = new Group({ name, code, description, ownerId });

      newGroup
        .save()
        .then((group: GroupDocument) => res.json(group))
        .catch((err: Error) =>
          res.status(400).json('Error [Add Group]: ' + err)
        );
      break;

    default:
      res.status(400).json('Error [Group operation not supported]');
      break;
  }
}
