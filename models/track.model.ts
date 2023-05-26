import mongoose from 'mongoose'

const Schema = mongoose.Schema

const trackSchema = new Schema(
  {
    groupId: {
      type: String,
    },
    gameId: {
      type: String,
    },
    // TODO: Remove once data / code migrated to use gameId
    game: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
  },
  {
    timestamps: true,
  }
)

const Track = mongoose.models.Track || mongoose.model('Track', trackSchema)

export default Track
