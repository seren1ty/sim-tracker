import dbConnect from '@/utils/db-connect';
import Driver from '@/models/driver.model';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { email },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET' /* Get driver by email */:
      Driver.findOne({ email })
        .then((driver) => res.json(driver))
        .catch((err) => res.status(400).json('Error [Get Driver]: ' + err));
      break;

    default:
      res.status(400).json('Error [Driver operation not supported]');
      break;
  }
}
