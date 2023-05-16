import dbConnect from '@/utils/db-connect';
import Car from '@/models/car.model';
import { NextApiRequest, NextApiResponse } from 'next';
import { CarDocument } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET': // Get all drivers
      Car.find()
        .collation({ locale: 'en', strength: 2 })
        .sort({ name: 1 })
        .then((cars) => res.json(cars))
        .catch((err) => res.status(400).json('Error [Get All Cars]: ' + err));
      break;

    case 'POST': // Add new car
      const game = req.body.game;
      const name = req.body.name;

      const newCar = new Car({ game, name });

      newCar
        .save()
        .then((car: CarDocument) => res.json(car))
        .catch((err: Error) => res.status(400).json('Error [Add Car]: ' + err));
      break;

    default:
      res.status(400).json('Error [Car operation not supported]');
      break;
  }
}
