import serverAuthCheck from '@/utils/server-auth-check';
import dbConnect from '@/utils/db-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAllGames, handleGameAdd } from '@/services/games.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res);

  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET': // Get all games
      try {
        const games = await getAllGames();
        res.json(games);
      } catch (err) {
        res.status(400).json('Error [Get All Games]: ' + err);
      }
      break;

    case 'POST': // Add new game
      try {
        const game = await handleGameAdd({
          groupId: req.body.groupId,
          name: req.body.name,
          code: req.body.code,
        });
        res.json(game);
      } catch (err) {
        res.status(400).json('Error [Add Game]: ' + err);
      }
      break;

    default:
      res.status(400).json('Error [Game operation not supported]');
      break;
  }
}
