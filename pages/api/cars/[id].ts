import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { getCarById, handleCarUpdate, handleCarPatch, handleCarDelete } from '@/services/cars.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res)

  const {
    query: { id },
    method,
  } = req

  await dbConnect()

  switch (method) {
    case 'GET' /* Get car by id */:
      try {
        const car = await getCarById(id as string)
        res.json(car)
      } catch (err) {
        res.status(400).json('Error [Get Car]: ' + err)
      }
      break

    case 'PUT': // Edit car (full update)
      try {
        const car = await handleCarUpdate(id as string, {
          groupId: req.body.groupId,
          gameId: req.body.gameId,
          name: req.body.name,
        })
        res.json(car)
      } catch (err) {
        res.status(400).json('Error [Edit Car]: ' + err)
      }
      break

    case 'PATCH': // Edit car (admin mode - name only)
      try {
        const car = await handleCarPatch(id as string, { name: req.body.name })
        res.json(car)
      } catch (err) {
        res.status(400).json('Error [Patch Car]: ' + err)
      }
      break

    case 'DELETE': // Delete car
      try {
        const car = await handleCarDelete(id as string)
        res.json(car)
      } catch (err) {
        res.status(400).json('Error [Delete Car]: ' + err)
      }
      break

    default:
      res.status(400).json('Error [Car operation not supported]')
      break
  }
}
