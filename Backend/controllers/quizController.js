const Quiz = require("../models/Quiz");

// Add or Update Quiz (Admin Only)
exports.addQuiz = async (req, res) => {
  try {
    let { title, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Quiz title and questions are required" });
    }

    title = title.trim();
    let quiz = await Quiz.findOne({ title: { $regex: new RegExp(`^${title}$`, "i") } });

    if (quiz) {
      quiz.questions.push(...questions);
      await quiz.save();
      return res.json({ message: "Questions added to existing quiz successfully" });
    } else {
      quiz = new Quiz({ title, questions });
      await quiz.save();
      return res.json({ message: "New quiz added successfully" });
    }
  } catch (error) {
    console.error("Error adding quiz:", error);
    res.status(500).json({ message: "Server error while adding quiz" });
  }
};



// Update Quiz (Admin Only)
exports.updateQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    let { title, questions } = req.body;

    if (!quizId) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }
    if (!title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Title and valid questions array are required" });
    }

    title = title.trim(); 

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $set: { title, questions } }, 
      { new: true, runValidators: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({ message: "Quiz updated successfully", quiz: updatedQuiz });
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ message: "Failed to update quiz", error: error.message });
  }
};




//  Delete Quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;

    if (!quizId) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }

    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found or already deleted" });
    }

    await Score.deleteMany({ quizId });

    res.json({ message: "Quiz deleted successfully", deletedQuiz });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Failed to delete quiz", error: error.message });
  }
};




//  Get All Quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({}, "title _id"); 
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
};




//  Get a Single Quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
};
