import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { getCarsByGame } from '@/services/cars.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res)

  const {
    query: { gameId },
    method,
  } = req

  await dbConnect()

  switch (method) {
    case 'GET' /* Get all cars for a specific game */:
      try {
        const cars = await getCarsByGame(gameId as string)
        res.json(cars)
      } catch (err) {
        res.status(400).json('Error [Get All Cars For Game]: ' + err)
      }
      break

    default:
      res.status(400).json('Error [Car operation not supported]')
      break
  }
}
