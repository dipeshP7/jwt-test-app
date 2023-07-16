import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) => {
  try {
    /**Add database configuration */
    const DB_OPTIONS = {
      dbName: "jwtdemo",
    };
    await mongoose.connect(DATABASE_URL, DB_OPTIONS);
    console.log(`Connected to database`);
  } catch (error) {
    console.log(`Unable to connect database ${error}`);
  }
};

export default connectDB;
