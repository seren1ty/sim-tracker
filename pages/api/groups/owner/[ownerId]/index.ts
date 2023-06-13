import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import Group from '@/models/group.model'
import { NextApiRequest, NextApiResponse } from 'next'

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
    case 'GET' /* Get all groups for an owner / driver */:
      Group.find({ ownerId })
        .collation({ locale: 'en', strength: 2 })
        .sort({ name: 1 })
        .then((groups) => res.json(groups))
        .catch((err) =>
          res.status(400).json('Error [Get All Groups For Owner]: ' + err)
        )
      break

    default:
      res.status(400).json('Error [Group operation not supported]')
      break
  }
}
