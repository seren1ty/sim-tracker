import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { getGroupsByOwner } from '@/services/groups.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res)

  const {
    query: { ownerId },
    method,
  } = req

  await dbConnect()

  switch (method) {
    case 'GET': // Get all groups for an owner / driver
      try {
        const groups = await getGroupsByOwner(ownerId as string)
        res.json(groups)
      } catch (err) {
        res.status(400).json('Error [Get All Groups For Owner]: ' + err)
      }
      break

    default:
      res.status(400).json('Error [Group operation not supported]')
      break
  }
}
