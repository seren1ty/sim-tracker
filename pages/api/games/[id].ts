import serverAuthCheck from '@/utils/server-auth-check';
import dbConnect from '@/utils/db-connect';
import Game from '@/models/game.model';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res);

  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET' /* Get game by id */:
      Game.findById(id)
        .then((game) => res.json(game))
        .catch((err) => res.status(400).json('Error [Get Game]: ' + err));
      break;

    case 'PUT': // Edit game (full update)
      Game.findByIdAndUpdate(id, { name: req.body.name })
        .then((game) => res.json(game))
        .catch((err: Error) =>
          res.status(400).json('Error [Edit Game]: ' + err)
        );
      break;

    case 'PATCH': // Edit game (admin mode - name only)
      // Only allow updating the name field from admin mode
      // Protected fields: groupId, code
      Game.findByIdAndUpdate(
        id,
        { name: req.body.name },
        { new: true, runValidators: true }
      )
        .then((game) => res.json(game))
        .catch((err: Error) =>
          res.status(400).json('Error [Patch Game]: ' + err)
        );
      break;

    case 'DELETE': // Delete game
      Game.findByIdAndDelete(id)
        .then((game) => res.json(game))
        .catch((err) => res.status(400).json('Error [Delete Game]: ' + err));
      break;

    default:
      res.status(400).json('Error [Game operation not supported]');
      break;
  }
}
