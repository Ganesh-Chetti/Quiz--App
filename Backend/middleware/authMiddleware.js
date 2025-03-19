const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided!" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token!" });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Forbidden!" });
  next();
};

module.exports = { verifyToken, verifyAdmin };
