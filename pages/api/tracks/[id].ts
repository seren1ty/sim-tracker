import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { getTrackById, handleTrackUpdate, handleTrackPatch, handleTrackDelete } from '@/services/tracks.service'

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
    case 'GET' /* Get track by id */:
      try {
        const track = await getTrackById(id as string)
        res.json(track)
      } catch (err) {
        res.status(400).json('Error [Get Track]: ' + err)
      }
      break

    case 'PUT': // Edit track (full update)
      try {
        const track = await handleTrackUpdate(id as string, {
          groupId: req.body.groupId,
          gameId: req.body.gameId,
          name: req.body.name,
        })
        res.json(track)
      } catch (err) {
        res.status(400).json('Error [Edit Track]: ' + err)
      }
      break

    case 'PATCH': // Edit track (admin mode - name only)
      try {
        const track = await handleTrackPatch(id as string, { name: req.body.name })
        res.json(track)
      } catch (err) {
        res.status(400).json('Error [Patch Track]: ' + err)
      }
      break

    case 'DELETE': // Delete track
      try {
        const track = await handleTrackDelete(id as string)
        res.json(track)
      } catch (err) {
        res.status(400).json('Error [Delete Track]: ' + err)
      }
      break

    default:
      res.status(400).json('Error [Track operation not supported]')
      break
  }
}
