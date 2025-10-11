import serverAuthCheck from '@/utils/server-auth-check';
import dbConnect from '@/utils/db-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { getGameById, handleGameUpdate, handleGamePatch, handleGameDelete } from '@/services/games.service';

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
      try {
        const game = await getGameById(id as string);
        res.json(game);
      } catch (err) {
        res.status(400).json('Error [Get Game]: ' + err);
      }
      break;

    case 'PUT': // Edit game (full update)
      try {
        const game = await handleGameUpdate(id as string, { name: req.body.name });
        res.json(game);
      } catch (err) {
        res.status(400).json('Error [Edit Game]: ' + err);
      }
      break;

    case 'PATCH': // Edit game (admin mode - name only)
      try {
        const game = await handleGamePatch(id as string, { name: req.body.name });
        res.json(game);
      } catch (err) {
        res.status(400).json('Error [Patch Game]: ' + err);
      }
      break;

    case 'DELETE': // Delete game
      try {
        const game = await handleGameDelete(id as string);
        res.json(game);
      } catch (err) {
        res.status(400).json('Error [Delete Game]: ' + err);
      }
      break;

    default:
      res.status(400).json('Error [Game operation not supported]');
      break;
  }
}
