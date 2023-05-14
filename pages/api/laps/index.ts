import dbConnect from '@/utils/db-connect';
import Lap from '@/models/lap.model';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      Lap.find()
        .then((laps) => res.json(laps))
        .catch((err) => res.status(400).json('Error [Get All Laps]: ' + err));
      break;

    default:
      res.status(400).json('Error [Lap operation not supported]');
      break;
  }
}
