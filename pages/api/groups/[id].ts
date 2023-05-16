import dbConnect from '@/utils/db-connect';
import Group from '@/models/group.model';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET': // Get group by id
      Group.findById(id)
        .then((group) => res.json(group))
        .catch((err) => res.status(400).json('Error [Get Group]: ' + err));
      break;

    case 'PUT': // Edit group
      Group.findByIdAndUpdate(id, {
        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
        adminId: req.body.ownerId,
      })
        .then((group) => res.json(group))
        .catch((err: Error) =>
          res.status(400).json('Error [Edit Group]: ' + err)
        );

    case 'DELETE': // Delete group
      Group.findByIdAndDelete(id)
        .then((group) => res.json(group))
        .catch((err) => res.status(400).json('Error [Delete Group]: ' + err));

    default:
      res.status(400).json('Error [Group operation not supported]');
      break;
  }
}
