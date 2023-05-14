import mongoose from 'mongoose';

const dbConnect = () => {
  if (mongoose.connection.readyState >= 1) {
    // if db not ready yet, return
    return;
  }

  if (!global.mongoose) {
    global.mongoose = mongoose
      .connect(process.env.MONGODB_URI as string, {})
      .catch((err) => console.log(err))
      .then((con) => console.log('Connected to MongoDB'));
  }

  return global.mongoose;
};

export default dbConnect;
