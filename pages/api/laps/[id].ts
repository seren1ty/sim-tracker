import dbConnect from '@/utils/db-connect';
import Lap from '@/models/lap.model';
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
    case 'GET' /* Get lap by id */:
      Lap.findById(id)
        .then((lap) => res.json(lap))
        .catch((err) => res.status(400).json('Error [Get Lap]: ' + err));
      break;

    default:
      res.status(400).json('Error [Lap operation not supported]');
      break;
  }
}
