import serverAuthCheck from '@/utils/server-auth-check';
import dbConnect from '@/utils/db-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAllDrivers, handleDriverAdd } from '@/services/drivers.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res);

  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET': // Get all drivers
      try {
        const drivers = await getAllDrivers();
        res.json(drivers);
      } catch (err) {
        res.status(400).json('Error [Get All Drivers]: ' + err);
      }
      break;

    case 'POST':
      try {
        const driver = await handleDriverAdd({
          groupIds: req.body.groupIds,
          name: req.body.name,
          email: req.body.email,
          isAdmin: req.body.isAdmin,
        });
        res.json(driver);
      } catch (err) {
        res.status(400).json('Error [Add Driver]: ' + err);
      }
      break;

    default:
      res.status(400).json('Error [Driver operation not supported]');
      break;
  }
}
