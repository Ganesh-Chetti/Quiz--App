import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/QuizList.css";

const QuizList = ({ onStartQuiz, onQuizProgress }) => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const response = await axios.get("http://localhost:5000/api/quizzes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, [navigate]);

  const handleQuizClick = (quizId) => {
    onStartQuiz(); // Notify Home component that the quiz has started
    navigate(`/quiz/${quizId}`);
  };

  return (
    <div className="quiz-list">
      <h2>Available Quizzes</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz._id} onClick={() => handleQuizClick(quiz._id)}>
            {quiz.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizList;
