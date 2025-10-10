import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import Driver from '@/models/driver.model'
import Lap from '@/models/lap.model'
import { NextApiRequest, NextApiResponse } from 'next'
import { DriverDocument } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res)

  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      Driver.find()
        .collation({ locale: 'en', strength: 2 })
        .then((drivers) => {
          // Handle empty array case
          if (drivers.length === 0) {
            return res.json([])
          }

          let newDrivers: DriverDocument[] = []

          drivers.forEach((driver) => {
            Lap.exists({ driver: driver.name }).then((result) => {
              driver._doc.hasLaps = result
              newDrivers.push(driver)

              if (newDrivers.length === drivers.length) {
                newDrivers.sort((a, b) => {
                  return a._doc.name > b._doc.name
                    ? 1
                    : b._doc.name > a._doc.name
                    ? -1
                    : 0
                })

                res.json(newDrivers)
              }
            })
          })
        })
        .catch((err) =>
          res.status(400).json('Error [Get All Drivers Laps]: ' + err)
        )
      break

    default:
      res.status(400).json('Error [Driver operation not supported]')
      break
  }
}
