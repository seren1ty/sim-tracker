import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { getAllLaps, handleLapAdd } from '@/services/laps.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res)

  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET': // Get all laps
      try {
        const laps = await getAllLaps()
        res.json(laps)
      } catch (err) {
        res.status(400).json('Error [Get All Laps]: ' + err)
      }
      break

    case 'POST': // Add new lap
      try {
        const lap = await handleLapAdd({
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
        res.status(400).json('Error [Add Lap]: ' + err)
      }
      break

    default:
      res.status(400).json('Error [Lap operation not supported]')
      break
  }
}
