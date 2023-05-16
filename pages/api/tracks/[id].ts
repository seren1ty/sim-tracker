import dbConnect from '@/utils/db-connect';
import Track from '@/models/track.model';
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
    case 'GET' /* Get track by id */:
      Track.findById(id)
        .then((track) => res.json(track))
        .catch((err) => res.status(400).json('Error [Get Track]: ' + err));
      break;

    default:
      res.status(400).json('Error [Track operation not supported]');
      break;
  }
}
