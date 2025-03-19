import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Quizzes.css"; // Ensure you have a CSS file for styling

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null); // Store question being edited
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("role") === "admin"; // Check if admin

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Fetch all quizzes
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const storedToken = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/quizzes", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      alert("Failed to fetch quizzes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch full quiz details when selected
  const handleSelectQuiz = async (quiz) => {
    if (isAdmin) {
      try {
        const storedToken = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/quizzes/${quiz._id}`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        setSelectedQuiz(response.data); // Now selectedQuiz will contain questions
      } catch (error) {
        console.error("Error fetching quiz details:", error);
        alert("Failed to fetch quiz details.");
      }
    }
  };

  // Delete quiz
  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        const storedToken = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/delete-quiz/${quizId}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        alert("Quiz deleted successfully!");
        setSelectedQuiz(null); // Deselect quiz if it was deleted
        fetchQuizzes(); // Refresh quizzes
      } catch (error) {
        console.error("Error deleting quiz:", error);
        alert("Failed to delete quiz. Please try again.");
      }
    }
  };

  // Handle editing a question
  const handleEditClick = (question) => {
    setEditingQuestion(question); // Set the question to be edited
  };

  // Handle updating the edited question
  const handleSaveQuestion = async (quizId) => {
    try {
      const storedToken = localStorage.getItem("token");

      // Update the question inside the quiz
      const updatedQuestions = selectedQuiz.questions.map((q) =>
        q._id === editingQuestion._id ? editingQuestion : q
      );

      await axios.put(
        `http://localhost:5000/api/update-quiz/${quizId}`,
        { title: selectedQuiz.title, questions: updatedQuestions },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      alert("Question updated successfully!");
      setEditingQuestion(null); // Clear edit mode
      handleSelectQuiz({ _id: quizId }); // Refresh quiz details
    } catch (error) {
      console.error("Error updating question:", error);
      alert("Failed to update question. Please try again.");
    }
  };

  // Delete a specific question from the quiz
  const handleDeleteQuestion = async (quizId, questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    try {
      const storedToken = localStorage.getItem("token");

      // Create a new questions array without the deleted question
      const updatedQuestions = selectedQuiz.questions.filter(
        (q) => q._id !== questionId
      );

      await axios.put(
        `http://localhost:5000/api/update-quiz/${quizId}`,
        { title: selectedQuiz.title, questions: updatedQuestions },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      alert("Question deleted successfully!");
      handleSelectQuiz({ _id: quizId }); // Refresh quiz details
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question. Please try again.");
    }
  };

  return (
    <div className="quizzes-container">
      <h2>Available Quizzes</h2>

      {loading ? (
        <p>Loading quizzes...</p>
      ) : quizzes.length === 0 ? (
        <p>No quizzes available.</p>
      ) : (
        quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="quiz-item"
            onClick={() => handleSelectQuiz(quiz)}
          >
            <h4>{quiz.title}</h4>
            {isAdmin && (
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteQuiz(quiz._id);
                }}
              >
                Delete Quiz
              </button>
            )}
          </div>
        ))
      )}

      {selectedQuiz?.questions?.length > 0 ? (
        selectedQuiz.questions.map((question) => (
          <div key={question._id} className="question-item">
            {editingQuestion && editingQuestion._id === question._id ? (
              <div>
                <input
                  type="text"
                  value={editingQuestion.question}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      question: e.target.value,
                    })
                  }
                  placeholder="Edit Question"
                />
                <select
                  value={editingQuestion.type}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="single">Single Choice</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                </select>
                <input
                  type="text"
                  value={editingQuestion.options.join(", ")}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      options: e.target.value.split(", "),
                    })
                  }
                  placeholder="Edit Options (comma separated)"
                />
                <input
                  type="text"
                  value={editingQuestion.correctAnswer.join(", ")}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      correctAnswer: e.target.value.split(", "),
                    })
                  }
                  placeholder="Edit Correct Answer (comma separated)"
                />
                <button
                  onClick={() => handleSaveQuestion(selectedQuiz._id)}
                  style={{ marginRight: "1rem" }}
                >
                  Save
                </button>
                <button onClick={() => setEditingQuestion(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>{question.question}</p>
                <p>
                  <strong>Type:</strong> {question.type}
                </p>{" "}
                {/* Display the question type */}
                <p>
                  <strong>Options:</strong> {question.options.join(", ")}
                </p>
                <p>
                  <strong>Correct Answer:</strong>{" "}
                  {Array.isArray(question.correctAnswer)
                    ? question.correctAnswer
                        .map((ans) => ans.toString())
                        .join(", ")
                    : typeof question.correctAnswer === "boolean"
                    ? question.correctAnswer
                      ? "True"
                      : "False"
                    : question.correctAnswer !== undefined
                    ? question.correctAnswer.toString()
                    : "N/A"}
                </p>
                <button
                  className="edit-btn"
                  onClick={() => handleEditClick(question)}
                >
                  Edit Question
                </button>
                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDeleteQuestion(selectedQuiz._id, question._id)
                  }
                >
                  Delete Question
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No questions available.</p>
      )}
    </div>
  );
};

export default Quizzes;
