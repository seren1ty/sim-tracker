import dbConnect from '@/utils/db-connect';
import Lap from '@/models/lap.model';
import { NextApiRequest, NextApiResponse } from 'next';
import { LapDocument } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET': // Get all laps
      Lap.find()
        .then((laps) => res.json(laps))
        .catch((err) => res.status(400).json('Error [Get All Laps]: ' + err));
      break;

    case 'POST': // Add new lap
      const game = req.body.game;
      const track = req.body.track;
      const car = req.body.car;
      const laptime = req.body.laptime;
      const driver = req.body.driver;
      const gearbox = req.body.gearbox;
      const traction = req.body.traction;
      const stability = req.body.stability;
      const replay = req.body.replay;
      const notes = req.body.notes;
      const date = Date.parse(req.body.date);

      const newLap = new Lap({
        game,
        track,
        car,
        laptime,
        driver,
        gearbox,
        traction,
        stability,
        replay,
        notes,
        date,
      });

      newLap
        .save()
        .then((lap: LapDocument) => res.json(lap))
        .catch((err: Error) => res.status(400).json('Error [Add Lap]: ' + err));

    default:
      res.status(400).json('Error [Lap operation not supported]');
      break;
  }
}
