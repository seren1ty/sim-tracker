import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { getAllCars, handleCarAdd } from '@/services/cars.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res)

  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET': // Get all drivers
      try {
        const cars = await getAllCars()
        res.json(cars)
      } catch (err) {
        res.status(400).json('Error [Get All Cars]: ' + err)
      }
      break

    case 'POST': // Add new car
      try {
        const car = await handleCarAdd({
          groupId: req.body.groupId,
          gameId: req.body.gameId,
          name: req.body.name,
        })
        res.json(car)
      } catch (err) {
        res.status(400).json('Error [Add Car]: ' + err)
      }
      break

    default:
      res.status(400).json('Error [Car operation not supported]')
      break
  }
}
