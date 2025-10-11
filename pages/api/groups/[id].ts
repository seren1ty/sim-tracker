import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  getGroupById,
  getGroupsByIds,
  handleGroupUpdate,
  handleGroupDelete,
} from '@/services/groups.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res)

  const {
    query: { id },
    method,
  } = req

  const queryId = id as string

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        if (queryId?.includes(',')) {
          // Get groups by ids
          const groups = await getGroupsByIds(queryId.split(','))
          res.json(groups)
        } else {
          // Get group by id
          const group = await getGroupById(queryId)
          res.json(group)
        }
      } catch (err) {
        res.status(400).json('Error [Get Group(s)]: ' + err)
      }
      break

    case 'PUT': // Edit group (full update)
      try {
        const group = await handleGroupUpdate(queryId, {
          name: req.body.name,
          code: req.body.code,
          description: req.body.description,
        })
        res.json(group)
      } catch (err: any) {
        res.status(400).json('Error [Edit Group]: ' + err)
      }
      break

    case 'PATCH': // Edit group (admin mode - name, code, description only)
      try {
        // Only allow updating specific fields from admin mode
        // Protected fields: ownerId, driverIds
        const updateData: any = {}
        if (req.body.name !== undefined) updateData.name = req.body.name
        if (req.body.code !== undefined) updateData.code = req.body.code
        if (req.body.description !== undefined)
          updateData.description = req.body.description

        const group = await handleGroupUpdate(queryId, updateData)
        res.json(group)
      } catch (err: any) {
        res.status(400).json('Error [Patch Group]: ' + err)
      }
      break

    case 'DELETE': // Delete group
      try {
        const group = await handleGroupDelete(queryId)
        res.json(group)
      } catch (err) {
        res.status(400).json('Error [Delete Group]: ' + err)
      }
      break

    default:
      res.status(400).json('Error [Group operation not supported]')
      break
  }
}
