import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function serverAuthCheck(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check user request has an authenticated JWT token
  if (!(await getToken({ req }))) {
    res.status(401).json('Error [Unauthorized]');
  }
}
