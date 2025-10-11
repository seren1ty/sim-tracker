import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { getTracksByGame } from '@/services/tracks.service'

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
      try {
        const tracks = await getTracksByGame(gameId as string)
        res.json(tracks)
      } catch (err) {
        res.status(400).json('Error [Get All Tracks For Game]: ' + err)
      }
      break

    default:
      res.status(400).json('Error [Track operation not supported]')
      break
  }
}
