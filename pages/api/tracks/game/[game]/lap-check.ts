import serverAuthCheck from '@/utils/server-auth-check';
import dbConnect from '@/utils/db-connect';
import Track from '@/models/track.model';
import Lap from '@/models/lap.model';
import { NextApiRequest, NextApiResponse } from 'next';
import { TrackDocument } from '@/types';

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
      Track.find({ game })
        .collation({ locale: 'en', strength: 2 })
        .then((tracks) => {
          let newTracks: TrackDocument[] = [];

          tracks.forEach((track) => {
            Lap.exists({ track: track.name }).then((result) => {
              track._doc.hasLaps = result;
              newTracks.push(track);

              if (newTracks.length === tracks.length) {
                newTracks.sort((a, b) => {
                  return a._doc.name > b._doc.name
                    ? 1
                    : b._doc.name > a._doc.name
                    ? -1
                    : 0;
                });

                res.json(newTracks);
              }
            });
          });
        })
        .catch((err) =>
          res.status(400).json('Error [Get All Tracks For Game]: ' + err)
        );
      break;

    default:
      res.status(400).json('Error [Track operation not supported]');
      break;
  }
}
