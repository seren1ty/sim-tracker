import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const lapSchema = new Schema(
  {
    game: { type: String, required: true },
    track: { type: String, required: true },
    car: { type: String, required: true },
    laptime: { type: String, required: true },
    driver: { type: String, required: true },
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
);

const Lap = mongoose.models.Lap || mongoose.model('Lap', lapSchema);

export default Lap;
