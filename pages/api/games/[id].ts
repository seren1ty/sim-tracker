import dbConnect from '@/utils/db-connect';
import Game from '@/models/game.model';
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
    case 'GET' /* Get game by id */:
      Game.findById(id)
        .then((game) => res.json(game))
        .catch((err) => res.status(400).json('Error [Get Game]: ' + err));
      break;

    default:
      res.status(400).json('Error [Game operation not supported]');
      break;
  }
}
