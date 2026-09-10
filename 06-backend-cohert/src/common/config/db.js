import mongoose from "mongoose";

const connectDB = async () => {
  const connection = await mongoose.connect(process.env.DATABASE_URL);
  console.log(`MongoDB Connected: ${connection.connection.host}`);
};

export default connectDB;
