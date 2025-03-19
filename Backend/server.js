const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const serverless = require('serverless-http');

const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const scoreRoutes = require("./routes/scoreRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// Routes
app.use("/api", authRoutes);
app.use("/api", quizRoutes);
app.use("/api", scoreRoutes);

// Export for Vercel
module.exports.handler = serverless(app);