import dbConnect from '@/utils/db-connect';
import Track from '@/models/track.model';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET': // Get all tracks
      Track.find()
        .collation({ locale: 'en', strength: 2 })
        .sort({ name: 1 })
        .then((tracks) => res.json(tracks))
        .catch((err) => res.status(400).json('Error [Get All Tracks]: ' + err));
      break;

    default:
      res.status(400).json('Error [Track operation not supported]');
      break;
  }
}
