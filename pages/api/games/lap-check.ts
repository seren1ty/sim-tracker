import serverAuthCheck from '@/utils/server-auth-check';
import dbConnect from '@/utils/db-connect';
import Game from '@/models/game.model';
import Lap from '@/models/lap.model';
import { NextApiRequest, NextApiResponse } from 'next';
import { GameDocument } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res);

  const {
    query: { game },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      Game.find()
        .collation({ locale: 'en', strength: 2 })
        .then((games) => {
          let newGames: GameDocument[] = [];

          games.forEach((game) => {
            Lap.exists({ game: game.name }).then((result) => {
              game._doc.hasLaps = result;
              newGames.push(game);

              if (newGames.length === games.length) {
                newGames.sort((a, b) => {
                  return a._doc.name > b._doc.name
                    ? 1
                    : b._doc.name > a._doc.name
                    ? -1
                    : 0;
                });

                res.json(newGames);
              }
            });
          });
        })
        .catch((err) =>
          res.status(400).json('Error [Get All Games Laps]: ' + err)
        );
      break;

    default:
      res.status(400).json('Error [Game operation not supported]');
      break;
  }
}
