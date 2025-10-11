import Track from '@/models/track.model'
import { updateLapsTrackName } from './laps.service'

export const getAllTracks = async () => {
  return await Track.find()
    .collation({ locale: 'en', strength: 2 })
    .sort({ name: 1 })
}

export const getTrackById = async (id: string) => {
  return await Track.findById(id)
}

export const getTracksByGame = async (gameId: string) => {
  return await Track.find({ gameId })
    .collation({ locale: 'en', strength: 2 })
    .sort({ name: 1 })
}

export const handleTrackAdd = async (trackData: {
  groupId: string
  gameId: string
  name: string
}) => {
  const newTrack = new Track({
    groupId: trackData.groupId,
    gameId: trackData.gameId,
    name: trackData.name,
  })

  return await newTrack.save()
}

export const handleTrackUpdate = async (
  id: string,
  updateData: {
    groupId?: string
    gameId?: string
    name?: string
  }
) => {
  const updatedTrack = await Track.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })

  // If name was updated, update all laps with this trackId
  if (updateData.name && updatedTrack) {
    await updateLapsTrackName(id, updateData.name)
  }

  return updatedTrack
}

export const handleTrackPatch = async (
  id: string,
  updateData: {
    name?: string
  }
) => {
  // Only allow updating the name field from admin mode
  // Protected fields: groupId, gameId
  const updatedTrack = await Track.findByIdAndUpdate(
    id,
    { name: updateData.name },
    { new: true, runValidators: true }
  )

  // Update all laps with this trackId
  if (updateData.name && updatedTrack) {
    await updateLapsTrackName(id, updateData.name)
  }

  return updatedTrack
}

export const handleTrackDelete = async (id: string) => {
  return await Track.findByIdAndDelete(id)
}

export const checkTrackHasLaps = async (trackId: string) => {
  // TODO: Implement lap checking logic
  // This should query the Lap collection to see if any laps exist for this track
  return false
}
