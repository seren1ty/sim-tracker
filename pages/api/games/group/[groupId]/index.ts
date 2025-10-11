import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { getGamesByGroup } from '@/services/games.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res)

  const {
    query: { groupId },
    method,
  } = req

  await dbConnect()

  switch (method) {
    case 'GET' /* Get all games for a specific group */:
      try {
        const games = await getGamesByGroup(groupId as string)
        res.json(games)
      } catch (err) {
        res.status(400).json('Error [Get All Games For Group]: ' + err)
      }
      break

    default:
      res.status(400).json('Error [Game operation not supported]')
      break
  }
}
