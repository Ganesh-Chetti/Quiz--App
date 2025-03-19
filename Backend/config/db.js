const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.set("strictQuery", true);

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    console.log("✅ Using cached database connection");
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: "majority",
    });
    console.log("✅ MongoDB Connected");
    cachedDb = db;
    return db;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
};

module.exports = connectDB;