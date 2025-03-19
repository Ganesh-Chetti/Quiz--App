const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const serverless = require('serverless-http'); 

const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const scoreRoutes = require("./routes/scoreRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

connectDB();
module.exports.handler = serverless(app); 

app.use("/api", authRoutes);
app.use("/api", quizRoutes);
app.use("/api", scoreRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
