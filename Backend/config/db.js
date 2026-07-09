import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      family: 4,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB ERROR:", err);
    throw err;
  }
};

export default connectDB;