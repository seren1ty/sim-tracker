import serverAuthCheck from '@/utils/server-auth-check';
import dbConnect from '@/utils/db-connect';
import Lap from '@/models/lap.model';
import { NextApiRequest, NextApiResponse } from 'next';

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
    case 'GET' /* Get all laps for a specific game */:
      Lap.find({ game: game })
        .collation({ locale: 'en', strength: 2 })
        .sort({ name: 1 })
        .then((laps) => res.json(laps))
        .catch((err) =>
          res.status(400).json('Error [Get All Laps For Game]: ' + err)
        );
      break;

    default:
      res.status(400).json('Error [Lap operation not supported]');
      break;
  }
}
