import dbConnect from '@/utils/db-connect';
import Driver from '@/models/driver.model';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET': // Get all drivers
      Driver.find()
        .collation({ locale: 'en', strength: 2 })
        .sort({ name: 1 })
        .then((drivers) => res.json(drivers))
        .catch((err) =>
          res.status(400).json('Error [Get All Drivers]: ' + err)
        );
      break;

    default:
      res.status(400).json('Error [Driver operation not supported]');
      break;
  }
}
