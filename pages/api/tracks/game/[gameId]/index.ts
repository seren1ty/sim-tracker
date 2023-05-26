import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import Track from '@/models/track.model'
import { NextApiRequest, NextApiResponse } from 'next'

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
    case 'GET' /* Get all tracks for a specific game */:
      Track.find({ gameId })
        .collation({ locale: 'en', strength: 2 })
        .sort({ name: 1 })
        .then((tracks) => res.json(tracks))
        .catch((err) =>
          res.status(400).json('Error [Get All Tracks For Game]: ' + err)
        )
      break

    default:
      res.status(400).json('Error [Track operation not supported]')
      break
  }
}
