import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import Car from '@/models/car.model'
import { NextApiRequest, NextApiResponse } from 'next'

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
    case 'GET' /* Get car by id */:
      Car.findById(id)
        .then((car) => res.json(car))
        .catch((err) => res.status(400).json('Error [Get Car]: ' + err))
      break

    case 'PUT': // Edit car (full update)
      Car.findByIdAndUpdate(id, {
        groupId: req.body.groupId,
        gameId: req.body.gameId,
        game: req.body.game,
        name: req.body.name,
      })
        .then((car) => res.json(car))
        .catch((err: Error) => res.status(400).json('Error [Edit Car]: ' + err))
      break

    case 'PATCH': // Edit car (admin mode - name only)
      // Only allow updating the name field from admin mode
      // Protected fields: groupId, gameId, game
      Car.findByIdAndUpdate(
        id,
        { name: req.body.name },
        { new: true, runValidators: true }
      )
        .then((car) => res.json(car))
        .catch((err: Error) =>
          res.status(400).json('Error [Patch Car]: ' + err)
        )
      break

    case 'DELETE': // Delete car
      Car.findByIdAndDelete(id)
        .then((car) => res.json(car))
        .catch((err) => res.status(400).json('Error [Delete Car]: ' + err))
      break

    default:
      res.status(400).json('Error [Car operation not supported]')
      break
  }
}
