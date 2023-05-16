import dbConnect from '@/utils/db-connect';
import Driver from '@/models/driver.model';
import { NextApiRequest, NextApiResponse } from 'next';
import { DriverDocument } from '@/types';

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

    case 'POST':
      const name = req.body.name;
      const email = req.body.email;
      const isAdmin = req.body.isAdmin;

      const newDriver = new Driver({ name, email, isAdmin });

      newDriver
        .save()
        .then((driver: DriverDocument) => res.json(driver))
        .catch((err: Error) =>
          res.status(400).json('Error [Add Driver]: ' + err)
        );

    default:
      res.status(400).json('Error [Driver operation not supported]');
      break;
  }
}
