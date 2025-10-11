import serverAuthCheck from '@/utils/server-auth-check';
import dbConnect from '@/utils/db-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { getDriverByEmail } from '@/services/drivers.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res);

  const {
    query: { email },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET' /* Get driver by email */:
      try {
        const driver = await getDriverByEmail(email as string);
        res.json(driver);
      } catch (err) {
        res.status(400).json('Error [Get Driver]: ' + err);
      }
      break;

    default:
      res.status(400).json('Error [Driver operation not supported]');
      break;
  }
}
