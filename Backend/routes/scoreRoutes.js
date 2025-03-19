const express = require("express");
const { submitQuiz, getLeaderboard, editScore, deleteScore } = require("../controllers/scoreController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();



// Score Routes
router.post("/submit-quiz", verifyToken, submitQuiz);
router.get("/leaderboard", verifyToken, verifyAdmin, getLeaderboard);



// Score Management (Admin Only)
router.put("/edit-score/:id", verifyToken, verifyAdmin, editScore);
router.delete("/delete-score/:id", verifyToken, verifyAdmin, deleteScore);

module.exports = router;
