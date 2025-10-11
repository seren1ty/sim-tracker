import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { getLapsByGame } from '@/services/laps.service'

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
    case 'GET' /* Get all laps for a specific game */:
      try {
        const laps = await getLapsByGame(gameId as string)
        res.json(laps)
      } catch (err) {
        res.status(400).json('Error [Get All Laps For Game]: ' + err)
      }
      break

    default:
      res.status(400).json('Error [Lap operation not supported]')
      break
  }
}
