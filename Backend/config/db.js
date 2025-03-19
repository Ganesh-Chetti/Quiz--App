const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables.");
  process.exit(1);
}

mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
