import Game from '@/models/game.model'
import { updateLapsGameName } from './laps.service'

export const getAllGames = async () => {
  return await Game.find()
    .collation({ locale: 'en', strength: 2 })
    .sort({ name: 1 })
}

export const getGameById = async (id: string) => {
  return await Game.findById(id)
}

export const getGamesByGroup = async (groupId: string) => {
  return await Game.find({ groupId })
    .collation({ locale: 'en', strength: 2 })
    .sort({ name: 1 })
}

export const handleGameAdd = async (gameData: {
  groupId: string
  name: string
  code: string
}) => {
  const newGame = new Game({
    groupId: gameData.groupId,
    name: gameData.name,
    code: gameData.code,
  })

  return await newGame.save()
}

export const handleGameUpdate = async (
  id: string,
  updateData: {
    name?: string
  }
) => {
  const updatedGame = await Game.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })

  // If name was updated, update all laps with this gameId
  if (updateData.name && updatedGame) {
    await updateLapsGameName(id, updateData.name)
  }

  return updatedGame
}

export const handleGamePatch = async (
  id: string,
  updateData: {
    name?: string
  }
) => {
  // Only allow updating the name field from admin mode
  // Protected fields: groupId, code
  const updatedGame = await Game.findByIdAndUpdate(
    id,
    { name: updateData.name },
    { new: true, runValidators: true }
  )

  // Update all laps with this gameId
  if (updateData.name && updatedGame) {
    await updateLapsGameName(id, updateData.name)
  }

  return updatedGame
}

export const handleGameDelete = async (id: string) => {
  return await Game.findByIdAndDelete(id)
}

export const checkGameHasLaps = async (gameId: string) => {
  // TODO: Implement lap checking logic
  // This should query the Lap collection to see if any laps exist for this game
  return false
}
