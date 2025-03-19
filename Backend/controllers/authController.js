const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;


exports.register = async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;

    if (await User.findOne({ username })) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, isAdmin });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ token, user: { _id: user._id, username: user.username, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
