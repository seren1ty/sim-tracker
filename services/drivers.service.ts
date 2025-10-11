import mongoose from 'mongoose'
import Driver from '@/models/driver.model'
import Group from '@/models/group.model'
import { updateLapsDriverName } from './laps.service'

export const getAllDrivers = async () => {
  return await Driver.find()
    .collation({ locale: 'en', strength: 2 })
    .sort({ name: 1 })
}

export const getDriverById = async (id: string) => {
  return await Driver.findById(id)
}

export const getDriverByEmail = async (email: string) => {
  return await Driver.findOne({ email })
}

export const handleDriverAdd = async (driverData: {
  groupIds: string[]
  name: string
  email: string
  isAdmin: boolean
}) => {
  const newDriver = new Driver({
    groupIds: driverData.groupIds,
    name: driverData.name,
    email: driverData.email,
    isAdmin: driverData.isAdmin,
  })

  // Use transaction to ensure atomicity of driver creation and group updates
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // Save the new driver within the transaction
    const savedDriver = await newDriver.save({ session })

    // Update all groups' driverIds array within the same transaction
    const groupUpdatePromises = []
    for (const groupId of savedDriver.groupIds) {
      const updatePromise = Group.findByIdAndUpdate(
        groupId,
        { $addToSet: { driverIds: savedDriver._id } }, // $addToSet prevents duplicates
        { session, new: true }
      )
      groupUpdatePromises.push(updatePromise)
    }

    await Promise.all(groupUpdatePromises)

    // Commit the transaction
    await session.commitTransaction()
    session.endSession()

    return savedDriver
  } catch (err) {
    // Rollback the transaction on error
    await session.abortTransaction()
    session.endSession()
    throw err
  }
}

export const handleDriverUpdate = async (
  id: string,
  updateData: {
    name?: string
  }
) => {
  const updatedDriver = await Driver.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })

  // If name was updated, update all laps with this driverId
  if (updateData.name && updatedDriver) {
    await updateLapsDriverName(id, updateData.name)
  }

  return updatedDriver
}

export const handleDriverPatch = async (
  id: string,
  updateData: {
    name?: string
    email?: string
    isAdmin?: boolean
  }
) => {
  // Only allow updating specific fields from admin mode
  // Protected fields: groupIds
  const allowedUpdates: any = {}
  if (updateData.name !== undefined) allowedUpdates.name = updateData.name
  if (updateData.email !== undefined) allowedUpdates.email = updateData.email
  if (updateData.isAdmin !== undefined) allowedUpdates.isAdmin = updateData.isAdmin

  const updatedDriver = await Driver.findByIdAndUpdate(id, allowedUpdates, {
    new: true,
    runValidators: true,
  })

  // If name was updated, update all laps with this driverId
  if (updateData.name && updatedDriver) {
    await updateLapsDriverName(id, updateData.name)
  }

  return updatedDriver
}

export const handleDriverDelete = async (id: string) => {
  // Use transaction to ensure atomicity of driver deletion and group updates
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // Find the driver to get its groupIds before deleting
    const driver = await Driver.findById(id).session(session)

    if (!driver) {
      await session.abortTransaction()
      session.endSession()
      throw new Error('Driver not found')
    }

    // Remove this driver's ID from all groups' driverIds arrays
    await Group.updateMany(
      { driverIds: id },
      { $pull: { driverIds: id } },
      { session }
    )

    // Delete the driver
    const deletedDriver = await Driver.findByIdAndDelete(id, { session })

    // Commit the transaction
    await session.commitTransaction()
    session.endSession()

    return deletedDriver
  } catch (err) {
    // Rollback the transaction on error
    await session.abortTransaction()
    session.endSession()
    throw err
  }
}

export const checkDriverHasLaps = async (driverId: string) => {
  // TODO: Implement lap checking logic
  // This should query the Lap collection to see if any laps exist for this driver
  return false
}
