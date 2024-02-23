import mongoose from "mongoose";

async function connectToDatabase() {
  try {
    const uri = process.env.DB_URI;
    if (uri) {
      await mongoose.connect(uri);
    }
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
export default connectToDatabase;