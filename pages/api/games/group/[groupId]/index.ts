import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import Game from '@/models/game.model'
import { NextApiRequest, NextApiResponse } from 'next'

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
      Game.find({ groupId })
        .collation({ locale: 'en', strength: 2 })
        .sort({ name: 1 })
        .then((games) => res.json(games))
        .catch((err) =>
          res.status(400).json('Error [Get All Games For Group]: ' + err)
        )
      break

    default:
      res.status(400).json('Error [Game operation not supported]')
      break
  }
}
