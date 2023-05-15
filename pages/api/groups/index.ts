import dbConnect from '@/utils/db-connect';
import Group from '@/models/group.model';
import { NextApiRequest, NextApiResponse } from 'next';

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

    default:
      res.status(400).json('Error [Group operation not supported]');
      break;
  }
}
