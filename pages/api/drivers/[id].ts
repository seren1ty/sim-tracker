import serverAuthCheck from '@/utils/server-auth-check';
import dbConnect from '@/utils/db-connect';
import Driver from '@/models/driver.model';
import { NextApiRequest, NextApiResponse } from 'next';
import { DriverDocument } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res);

  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET': // Get driver by id
      Driver.findById(id)
        .then((driver) => res.json(driver))
        .catch((err) => res.status(400).json('Error [Get Driver]: ' + err));
      break;

    case 'PUT': // Edit driver
      Driver.findByIdAndUpdate(id, { name: req.body.name })
        .then((driver) => res.json(driver))
        .catch((err: Error) =>
          res.status(400).json('Error [Edit Driver]: ' + err)
        );
      break;

    case 'DELETE': // Delete driver
      Driver.findByIdAndDelete(id)
        .then((driver) => res.json(driver))
        .catch((err) => res.status(400).json('Error [Delete Driver]: ' + err));
      break;

    default:
      res.status(400).json('Error [Driver operation not supported]');
      break;
  }
}
