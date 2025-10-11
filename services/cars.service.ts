import Car from '@/models/car.model'
import { updateLapsCarName } from './laps.service'

export const getAllCars = async () => {
  return await Car.find()
    .collation({ locale: 'en', strength: 2 })
    .sort({ name: 1 })
}

export const getCarById = async (id: string) => {
  return await Car.findById(id)
}

export const getCarsByGame = async (gameId: string) => {
  return await Car.find({ gameId })
    .collation({ locale: 'en', strength: 2 })
    .sort({ name: 1 })
}

export const handleCarAdd = async (carData: {
  groupId: string
  gameId: string
  name: string
}) => {
  const newCar = new Car({
    groupId: carData.groupId,
    gameId: carData.gameId,
    name: carData.name,
  })

  return await newCar.save()
}

export const handleCarUpdate = async (
  id: string,
  updateData: {
    groupId?: string
    gameId?: string
    name?: string
  }
) => {
  const updatedCar = await Car.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })

  // If name was updated, update all laps with this carId
  if (updateData.name && updatedCar) {
    await updateLapsCarName(id, updateData.name)
  }

  return updatedCar
}

export const handleCarPatch = async (
  id: string,
  updateData: {
    name?: string
  }
) => {
  // Only allow updating the name field from admin mode
  // Protected fields: groupId, gameId
  const updatedCar = await Car.findByIdAndUpdate(
    id,
    { name: updateData.name },
    { new: true, runValidators: true }
  )

  // Update all laps with this carId
  if (updateData.name && updatedCar) {
    await updateLapsCarName(id, updateData.name)
  }

  return updatedCar
}

export const handleCarDelete = async (id: string) => {
  return await Car.findByIdAndDelete(id)
}

export const checkCarHasLaps = async (carId: string) => {
  // TODO: Implement lap checking logic
  // This should query the Lap collection to see if any laps exist for this car
  return false
}
