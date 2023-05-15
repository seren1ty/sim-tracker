import dbConnect from '@/utils/db-connect';
import Game from '@/models/game.model';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET': // Get all games
      Game.find()
        .collation({ locale: 'en', strength: 2 })
        .sort({ name: 1 })
        .then((games) => res.json(games))
        .catch((err) => res.status(400).json('Error [Get All Games]: ' + err));
      break;

    default:
      res.status(400).json('Error [Game operation not supported]');
      break;
  }
}
