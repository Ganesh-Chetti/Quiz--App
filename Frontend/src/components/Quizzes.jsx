import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Quizzes.css"; 

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("role") === "admin"; 

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const storedToken = localStorage.getItem("token");
      const response = await axios.get("https://quiz-app-back.vercel.app/api/quizzes", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setQuizzes(response.data);
    } catch (error) {
      toast.error("Failed to fetch quizzes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuiz = async (quiz) => {
    if (isAdmin) {
      try {
        const storedToken = localStorage.getItem("token");
        const response = await axios.get(
          `https://quiz-app-back.vercel.app/api/quizzes/${quiz._id}`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        setSelectedQuiz(response.data);
      } catch (error) {
        toast.error("Failed to fetch quiz details.");
      }
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        const storedToken = localStorage.getItem("token");
        await axios.delete(`https://quiz-app-back.vercel.app/api/delete-quiz/${quizId}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        toast.success("Quiz deleted successfully!");
        setSelectedQuiz(null); 
        fetchQuizzes(); 
      } catch (error) {
        toast.error("Failed to delete quiz. Please try again.");
      }
    }
  };

  const handleEditClick = (question) => {
    setEditingQuestion(question); 
  };

  const handleSaveQuestion = async (quizId) => {
    try {
      const storedToken = localStorage.getItem("token");
      const updatedQuestions = selectedQuiz.questions.map((q) =>
        q._id === editingQuestion._id ? editingQuestion : q
      );

      await axios.put(
        `https://quiz-app-back.vercel.app/api/update-quiz/${quizId}`,
        { title: selectedQuiz.title, questions: updatedQuestions },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      toast.success("Question updated successfully!");
      setEditingQuestion(null); 
      handleSelectQuiz({ _id: quizId });
    } catch (error) {
      toast.error("Failed to update question. Please try again.");
    }
  };
  const handleDeleteQuestion = async (quizId, questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    try {
      const storedToken = localStorage.getItem("token");
      const updatedQuestions = selectedQuiz.questions.filter(
        (q) => q._id !== questionId
      );

      await axios.put(
        `https://quiz-app-back.vercel.app/api/update-quiz/${quizId}`,
        { title: selectedQuiz.title, questions: updatedQuestions },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      toast.success("Question deleted successfully!");
      handleSelectQuiz({ _id: quizId });
    } catch (error) {
      toast.error("Failed to delete question. Please try again.");
    }
  };

  return (
    <div className="quizzes-container">
       <div className="top-bar">
        <h2>Available Quizzes</h2>
        <button className="back-button" onClick={()=>navigate("/admin")}>
          ← Back
        </button>
      </div>

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


<ToastContainer position="top-center" autoClose={2000} />

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
