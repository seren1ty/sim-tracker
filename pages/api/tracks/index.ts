import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import Track from '@/models/track.model'
import { NextApiRequest, NextApiResponse } from 'next'
import { TrackDocument } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res)

  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET': // Get all tracks
      Track.find()
        .collation({ locale: 'en', strength: 2 })
        .sort({ name: 1 })
        .then((tracks) => res.json(tracks))
        .catch((err) => res.status(400).json('Error [Get All Tracks]: ' + err))
      break

    case 'POST': // Add new track
      const newTrack = new Track({
        groupId: req.body.groupId,
        gameId: req.body.gameId,
        game: req.body.game,
        name: req.body.name,
      })

      newTrack
        .save()
        .then((track: TrackDocument) => res.json(track))
        .catch((err: Error) =>
          res.status(400).json('Error [Add Track]: ' + err)
        )
      break

    default:
      res.status(400).json('Error [Track operation not supported]')
      break
  }
}
