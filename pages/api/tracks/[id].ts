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

    case 'PUT': // Edit track
      Track.findByIdAndUpdate(id, { game: req.body.game, name: req.body.name })
        .then((track) => res.json(track))
        .catch((err: Error) =>
          res.status(400).json('Error [Edit Track]: ' + err)
        );

    case 'DELETE': // Delete track
      Track.findByIdAndDelete(id)
        .then((track) => res.json(track))
        .catch((err) => res.status(400).json('Error [Delete Track]: ' + err));

    default:
      res.status(400).json('Error [Track operation not supported]');
      break;
  }
}
