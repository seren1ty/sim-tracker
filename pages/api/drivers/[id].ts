import serverAuthCheck from '@/utils/server-auth-check';
import dbConnect from '@/utils/db-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { getDriverById, handleDriverUpdate, handleDriverPatch, handleDriverDelete } from '@/services/drivers.service';

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
      try {
        const driver = await getDriverById(id as string);
        res.json(driver);
      } catch (err) {
        res.status(400).json('Error [Get Driver]: ' + err);
      }
      break;

    case 'PUT': // Edit driver (full update)
      try {
        const driver = await handleDriverUpdate(id as string, { name: req.body.name });
        res.json(driver);
      } catch (err) {
        res.status(400).json('Error [Edit Driver]: ' + err);
      }
      break;

    case 'PATCH': // Edit driver (admin mode - name, email, isAdmin)
      try {
        const driver = await handleDriverPatch(id as string, {
          name: req.body.name,
          email: req.body.email,
          isAdmin: req.body.isAdmin,
        });
        res.json(driver);
      } catch (err) {
        res.status(400).json('Error [Patch Driver]: ' + err);
      }
      break;

    case 'DELETE': // Delete driver
      try {
        const driver = await handleDriverDelete(id as string);
        res.json(driver);
      } catch (err) {
        res.status(400).json('Error [Delete Driver]: ' + err);
      }
      break;

    default:
      res.status(400).json('Error [Driver operation not supported]');
      break;
  }
}
