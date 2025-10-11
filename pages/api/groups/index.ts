import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { getAllGroups, handleGroupAdd } from '@/services/groups.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res)

  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET': // Get all groups
      try {
        const groups = await getAllGroups()
        res.json(groups)
      } catch (err) {
        res.status(400).json('Error [Get All Groups]: ' + err)
      }
      break

    case 'POST': // Add new group
      try {
        const savedGroup = await handleGroupAdd({
          name: req.body.name,
          code: req.body.code,
          description: req.body.description,
          ownerId: req.body.ownerId,
          driverIds: req.body.driverIds || [],
        })
        res.json(savedGroup)
      } catch (err: any) {
        res.status(400).json('Error [Add Group]: ' + err)
      }
      break

    default:
      res.status(400).json('Error [Group operation not supported]')
      break
  }
}
