const Score = require("../models/Score");
const Quiz = require("../models/Quiz");
const mongoose = require("mongoose");

// Submit Quiz
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, userId, username, answers } = req.body;

    if (!quizId || !userId || !username || !answers) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      if (Array.isArray(userAnswer)) {
        if (question.correctAnswer.sort().join() === userAnswer.sort().join()) {
          score++;
        }
      } else {
        if (question.correctAnswer.includes(userAnswer)) {
          score++;
        }
      }
    });

    let existingScore = await Score.findOne({ quizId, userId });

    if (existingScore) {
      existingScore.score = score;
      await existingScore.save();
      return res.json({ message: "Score updated successfully!", score });
    } else {
      const newScore = new Score({ userId, username, quizId, quizTitle: quiz.title, score });
      await newScore.save();
      return res.json({ message: "Quiz submitted successfully!", score });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error while submitting quiz" });
  }
};



// Get Leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Score.find().sort({ score: -1 }).limit(10);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};




// Edit a User's Score
exports.editScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { newScore } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid score ID format" });
    }

    if (typeof newScore !== "number" || newScore < 0) {
      return res.status(400).json({ message: "Invalid score value" });
    }

    const updatedScore = await Score.findByIdAndUpdate(
      id,
      { score: newScore },
      { new: true }
    );

    if (!updatedScore) return res.status(404).json({ message: "Score not found" });

    res.json({ message: "Score updated successfully!", updatedScore });
  } catch (error) {
    res.status(500).json({ message: "Failed to update score" });
  }
};



// Delete a User's Score
exports.deleteScore = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid score ID format" });
    }

    const deletedScore = await Score.findByIdAndDelete(id);

    if (!deletedScore) return res.status(404).json({ message: "Score not found" });

    res.json({ message: "Score deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete score" });
  }
};
