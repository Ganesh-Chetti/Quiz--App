const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  questions: [
    {
      question: { type: String, required: true },
      type: { type: String, enum: ["single", "multiple", "true_false"], required: true },
      options: [{ type: String, required: true }],
      correctAnswer: [{ type: String, required: true }],
    },
  ],
});

module.exports = mongoose.model("Quiz", quizSchema);
