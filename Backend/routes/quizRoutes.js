const express = require("express");
const {
  addQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizzes,
  getQuizById,
} = require("../controllers/quizController");

const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();



// Public Quiz Routes (Authenticated Users)
router.get("/quizzes", verifyToken, getQuizzes);
router.get("/quizzes/:id", verifyToken, getQuizById);




// Admin Quiz Routes
router.post("/add-quiz", verifyToken, verifyAdmin, addQuiz);
router.put("/update-quiz/:id", verifyToken, verifyAdmin, updateQuiz);
router.delete("/delete-quiz/:id", verifyToken, verifyAdmin, deleteQuiz);

module.exports = router;
