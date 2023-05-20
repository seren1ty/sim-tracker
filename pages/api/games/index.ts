import serverAuthCheck from '@/utils/server-auth-check';
import dbConnect from '@/utils/db-connect';
import Game from '@/models/game.model';
import { NextApiRequest, NextApiResponse } from 'next';
import { GameDocument } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res);

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

    case 'POST': // Add new game
      const name = req.body.name;
      const code = req.body.code;

      const newGame = new Game({ name, code });

      newGame
        .save()
        .then((game: GameDocument) => res.json(game))
        .catch((err: Error) =>
          res.status(400).json('Error [Add Game]: ' + err)
        );
      break;

    default:
      res.status(400).json('Error [Game operation not supported]');
      break;
  }
}
