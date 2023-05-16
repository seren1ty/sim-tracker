import dbConnect from '@/utils/db-connect';
import Track from '@/models/track.model';
import { NextApiRequest, NextApiResponse } from 'next';
import { TrackDocument } from '@/types';

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

    case 'POST': // Add new track
      const game = req.body.game;
      const name = req.body.name;

      const newTrack = new Track({ game, name });

      newTrack
        .save()
        .then((track: TrackDocument) => res.json(track))
        .catch((err: Error) =>
          res.status(400).json('Error [Add Track]: ' + err)
        );
      break;

    default:
      res.status(400).json('Error [Track operation not supported]');
      break;
  }
}
