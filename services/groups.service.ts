import mongoose from 'mongoose'
import Group from '@/models/group.model'
import Driver from '@/models/driver.model'
import { updateLapsGroupName } from './laps.service'

export const getAllGroups = async () => {
  return await Group.find()
    .collation({ locale: 'en', strength: 2 })
    .sort({ name: 1 })
}

export const getGroupById = async (id: string) => {
  return await Group.findById(id)
}

export const getGroupsByIds = async (ids: string[]) => {
  return await Group.find({ _id: { $in: ids } })
    .collation({ locale: 'en', strength: 2 })
    .sort({ name: 1 })
}

export const getGroupsByOwner = async (ownerId: string) => {
  return await Group.find({ ownerId: ownerId })
    .collation({ locale: 'en', strength: 2 })
    .sort({ name: 1 })
}

export const handleGroupAdd = async (groupData: {
  name: string
  code: string
  description: string
  ownerId: string
  driverIds: string[]
}) => {
  const newGroup = new Group({
    name: groupData.name,
    code: groupData.code,
    description: groupData.description,
    ownerId: groupData.ownerId,
    driverIds: groupData.driverIds,
  })

  // Use transaction to ensure atomicity of group creation and driver updates
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // Save the new group within the transaction
    const savedGroup = await newGroup.save({ session })

    // Update all drivers' groupIds array within the same transaction
    const driverUpdatePromises = []
    for (const driverId of savedGroup.driverIds) {
      const updatePromise = Driver.findByIdAndUpdate(
        driverId,
        { $addToSet: { groupIds: savedGroup._id } }, // $addToSet prevents duplicates
        { session, new: true }
      )
      driverUpdatePromises.push(updatePromise)
    }

    await Promise.all(driverUpdatePromises)

    // Commit the transaction
    await session.commitTransaction()
    session.endSession()

    return savedGroup
  } catch (err) {
    // Rollback the transaction on error
    await session.abortTransaction()
    session.endSession()
    throw err
  }
}

export const handleGroupUpdate = async (
  id: string,
  updateData: {
    name?: string
    code?: string
    description?: string
  }
) => {
  const updatedGroup = await Group.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })

  // If name was updated, update all laps with this groupId
  if (updateData.name && updatedGroup) {
    await updateLapsGroupName(id, updateData.name)
  }

  return updatedGroup
}

export const handleGroupDelete = async (id: string) => {
  // Use transaction to ensure atomicity of group deletion and driver updates
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // Find the group to get its driverIds before deleting
    const group = await Group.findById(id).session(session)

    if (!group) {
      await session.abortTransaction()
      session.endSession()
      throw new Error('Group not found')
    }

    // Remove this group's ID from all drivers' groupIds arrays
    await Driver.updateMany(
      { groupIds: id },
      { $pull: { groupIds: id } },
      { session }
    )

    // Delete the group
    const deletedGroup = await Group.findByIdAndDelete(id, { session })

    // Commit the transaction
    await session.commitTransaction()
    session.endSession()

    return deletedGroup
  } catch (err) {
    // Rollback the transaction on error
    await session.abortTransaction()
    session.endSession()
    throw err
  }
}

export const checkGroupHasLaps = async (groupId: string) => {
  // TODO: Implement lap checking logic
  // This should query the Lap collection to see if any laps exist for this group
  return false
}
