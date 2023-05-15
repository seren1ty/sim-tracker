import dbConnect from '@/utils/db-connect';
import Car from '@/models/car.model';
import { NextApiRequest, NextApiResponse } from 'next';

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

    default:
      res.status(400).json('Error [Car operation not supported]');
      break;
  }
}
