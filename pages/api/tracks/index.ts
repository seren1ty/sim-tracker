import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { getAllTracks, handleTrackAdd } from '@/services/tracks.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res)

  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET': // Get all tracks
      try {
        const tracks = await getAllTracks()
        res.json(tracks)
      } catch (err) {
        res.status(400).json('Error [Get All Tracks]: ' + err)
      }
      break

    case 'POST': // Add new track
      try {
        const track = await handleTrackAdd({
          groupId: req.body.groupId,
          gameId: req.body.gameId,
          name: req.body.name,
        })
        res.json(track)
      } catch (err) {
        res.status(400).json('Error [Add Track]: ' + err)
      }
      break

    default:
      res.status(400).json('Error [Track operation not supported]')
      break
  }
}
