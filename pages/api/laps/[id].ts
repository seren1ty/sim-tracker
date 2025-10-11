import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { getLapById, handleLapUpdate, handleLapDelete } from '@/services/laps.service'

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
    case 'GET' /* Get lap by id */:
      try {
        const lap = await getLapById(id as string)
        res.json(lap)
      } catch (err) {
        res.status(400).json('Error [Get Lap]: ' + err)
      }
      break

    case 'PUT': // Edit lap
      try {
        const lap = await handleLapUpdate(id as string, {
          groupId: req.body.groupId,
          group: req.body.group,
          gameId: req.body.gameId,
          game: req.body.game,
          trackId: req.body.trackId,
          track: req.body.track,
          carId: req.body.carId,
          car: req.body.car,
          driverId: req.body.driverId,
          driver: req.body.driver,
          laptime: req.body.laptime,
          gearbox: req.body.gearbox,
          traction: req.body.traction,
          stability: req.body.stability,
          replay: req.body.replay,
          notes: req.body.notes,
          date: req.body.date,
        })
        res.json(lap)
      } catch (err) {
        res.status(400).json('Error [Edit Lap]: ' + err)
      }
      break

    case 'DELETE': // Delete lap
      try {
        const lap = await handleLapDelete(id as string)
        res.json(lap)
      } catch (err) {
        res.status(400).json('Error [Delete Lap]: ' + err)
      }
      break

    default:
      res.status(400).json('Error [Lap operation not supported]')
      break
  }
}
