import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const carSchema = new Schema(
  {
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
);

const Car = mongoose.models.Car || mongoose.model('Car', carSchema);

export default Car;
