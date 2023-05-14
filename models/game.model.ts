import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const gameSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);

export default Game;
