import serverAuthCheck from '@/utils/server-auth-check'
import dbConnect from '@/utils/db-connect'
import Group from '@/models/group.model'
import Game from '@/models/game.model'
import { NextApiRequest, NextApiResponse } from 'next'
import { GroupDocument } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await serverAuthCheck(req, res)

  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      Group.find()
        .collation({ locale: 'en', strength: 2 })
        .then((groups) => {
          // Handle empty array case
          if (groups.length === 0) {
            return res.json([])
          }

          let newGroups: GroupDocument[] = []

          groups.forEach((group) => {
            Game.exists({ groupId: group._id }).then((result) => {
              group._doc.hasGames = result
              newGroups.push(group)

              if (newGroups.length === groups.length) {
                newGroups.sort((a, b) => {
                  return a._doc.name > b._doc.name
                    ? 1
                    : b._doc.name > a._doc.name
                    ? -1
                    : 0
                })

                res.json(newGroups)
              }
            })
          })
        })
        .catch((err) =>
          res.status(400).json('Error [Get All Groups Games]: ' + err)
        )
      break

    default:
      res.status(400).json('Error [Group operation not supported]')
      break
  }
}
