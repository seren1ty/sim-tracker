import mongoose from 'mongoose'

const Schema = mongoose.Schema

const lapSchema = new Schema(
  {
    groupId: { type: String },
    group: { type: String },
    gameId: { type: String },
    game: { type: String, required: true },
    trackId: { type: String },
    track: { type: String, required: true },
    carId: { type: String },
    car: { type: String, required: true },
    driverId: { type: String },
    driver: { type: String, required: true },
    laptime: { type: String, required: true },
    gearbox: { type: String, required: true },
    traction: { type: String, required: true },
    stability: { type: String, required: true },
    replay: { type: String },
    notes: { type: String },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
)

const Lap = mongoose.models.Lap || mongoose.model('Lap', lapSchema)

export default Lap
