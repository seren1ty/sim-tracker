import dbConnect from '@/utils/db-connect';
import Car from '@/models/car.model';
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
    case 'GET' /* Get car by id */:
      Car.findById(id)
        .then((car) => res.json(car))
        .catch((err) => res.status(400).json('Error [Get Car]: ' + err));
      break;

    case 'PUT': // Edit car
      Car.findByIdAndUpdate(id, { game: req.body.game, name: req.body.name })
        .then((car) => res.json(car))
        .catch((err: Error) =>
          res.status(400).json('Error [Edit Car]: ' + err)
        );
      break;

    case 'DELETE': // Delete car
      Car.findByIdAndDelete(id)
        .then((car) => res.json(car))
        .catch((err) => res.status(400).json('Error [Delete Car]: ' + err));
      break;

    default:
      res.status(400).json('Error [Car operation not supported]');
      break;
  }
}
