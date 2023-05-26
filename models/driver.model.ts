import mongoose from 'mongoose'

const Schema = mongoose.Schema

const driverSchema = new Schema(
  {
    groupId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 5,
    },
    isAdmin: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
)

const Driver = mongoose.models.Driver || mongoose.model('Driver', driverSchema)

export default Driver
