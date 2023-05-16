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

    case 'PUT': // Edit lap
      Lap.findByIdAndUpdate(id, {
        game: req.body.game,
        track: req.body.track,
        car: req.body.car,
        laptime: req.body.laptime,
        driver: req.body.driver,
        gearbox: req.body.gearbox,
        traction: req.body.traction,
        stability: req.body.stability,
        replay: req.body.replay,
        notes: req.body.notes,
        date: Date.parse(req.body.date),
      })
        .then((lap) => res.json(lap))
        .catch((err: Error) =>
          res.status(400).json('Error [Edit Lap]: ' + err)
        );

    case 'DELETE': // Delete lap
      Lap.findByIdAndDelete(id)
        .then((lap) => res.json(lap))
        .catch((err) => res.status(400).json('Error [Delete Lap]: ' + err));

    default:
      res.status(400).json('Error [Lap operation not supported]');
      break;
  }
}
