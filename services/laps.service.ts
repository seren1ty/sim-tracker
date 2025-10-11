import Lap from '@/models/lap.model'

export const getAllLaps = async () => {
  return await Lap.find()
}

export const getLapById = async (id: string) => {
  return await Lap.findById(id)
}

export const getLapsByGame = async (gameId: string) => {
  return await Lap.find({ gameId })
}

export const handleLapAdd = async (lapData: {
  groupId: string
  group: string
  gameId: string
  game: string
  trackId: string
  track: string
  carId: string
  car: string
  driverId: string
  driver: string
  laptime: number
  gearbox: string
  traction: string
  stability: string
  replay: string
  notes: string
  date: string
}) => {
  const newLap = new Lap({
    groupId: lapData.groupId,
    group: lapData.group,
    gameId: lapData.gameId,
    game: lapData.game,
    trackId: lapData.trackId,
    track: lapData.track,
    carId: lapData.carId,
    car: lapData.car,
    driverId: lapData.driverId,
    driver: lapData.driver,
    laptime: lapData.laptime,
    gearbox: lapData.gearbox,
    traction: lapData.traction,
    stability: lapData.stability,
    replay: lapData.replay,
    notes: lapData.notes,
    date: Date.parse(lapData.date),
  })

  return await newLap.save()
}

export const handleLapUpdate = async (
  id: string,
  lapData: {
    groupId: string
    group: string
    gameId: string
    game: string
    trackId: string
    track: string
    carId: string
    car: string
    driverId: string
    driver: string
    laptime: number
    gearbox: string
    traction: string
    stability: string
    replay: string
    notes: string
    date: string
  }
) => {
  const updateData = {
    groupId: lapData.groupId,
    group: lapData.group,
    gameId: lapData.gameId,
    game: lapData.game,
    trackId: lapData.trackId,
    track: lapData.track,
    carId: lapData.carId,
    car: lapData.car,
    driverId: lapData.driverId,
    driver: lapData.driver,
    laptime: lapData.laptime,
    gearbox: lapData.gearbox,
    traction: lapData.traction,
    stability: lapData.stability,
    replay: lapData.replay,
    notes: lapData.notes,
    date: Date.parse(lapData.date),
  }

  return await Lap.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
}

export const handleLapDelete = async (id: string) => {
  return await Lap.findByIdAndDelete(id)
}

// Helper functions to update denormalized data in laps
export const updateLapsGroupName = async (groupId: string, newName: string) => {
  return await Lap.updateMany(
    { groupId },
    { $set: { group: newName } }
  )
}

export const updateLapsGameName = async (gameId: string, newName: string) => {
  return await Lap.updateMany(
    { gameId },
    { $set: { game: newName } }
  )
}

export const updateLapsTrackName = async (trackId: string, newName: string) => {
  return await Lap.updateMany(
    { trackId },
    { $set: { track: newName } }
  )
}

export const updateLapsCarName = async (carId: string, newName: string) => {
  return await Lap.updateMany(
    { carId },
    { $set: { car: newName } }
  )
}

export const updateLapsDriverName = async (driverId: string, newName: string) => {
  return await Lap.updateMany(
    { driverId },
    { $set: { driver: newName } }
  )
}
