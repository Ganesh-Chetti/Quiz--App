import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/Quiz.css";

const Quiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`https://quiz-app-back.vercel.app/api/quizzes/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setQuiz(response.data);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError(err.response ? err.response.data.message : "Error fetching quiz");
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswer = (questionIndex, selectedOption) => {
    if (submitted) return;

    setAnswers((prev) => {
      const updatedAnswers = { ...prev };

      if (quiz.questions[questionIndex].type === "multiple") {
        const currentAnswers = updatedAnswers[questionIndex] || [];
        if (currentAnswers.includes(selectedOption)) {
          updatedAnswers[questionIndex] = currentAnswers.filter((ans) => ans !== selectedOption);
        } else {
          updatedAnswers[questionIndex] = [...currentAnswers, selectedOption];
        }
      } else {
        updatedAnswers[questionIndex] = [selectedOption];
      }

      const answeredQuestions = Object.keys(updatedAnswers).length;
      const totalQuestions = quiz.questions.length;
      setProgress((answeredQuestions / totalQuestions) * 100);

      return updatedAnswers;
    });
  };

  const submitQuiz = async () => {
    if (Object.keys(answers).length !== quiz.questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setSubmitted(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "https://quiz-app-back.vercel.app/api/submit-quiz",
        {
          quizId: id,
          userId: user ? user._id : null,
          username: user ? user.username : null,
          answers,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      setScore(response.data.score);
      alert(`Quiz submitted! Your score: ${response.data.score}`);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Error submitting quiz. Please try again.");
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!quiz) return <p className="loading">Loading...</p>;

  return (
    <div className="quiz-container">
      <h2>{quiz.title}</h2>

      <h3>No Of Questions Attemped</h3>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      {quiz.questions.map((q, index) => (
        <div key={q._id} className="question-block">
          <p className="question-text"><strong>Question {index + 1}:</strong> {q.question}</p>

          <div className="options-container">
            {q.options.map((opt, optIndex) => (
              <button
                key={`${index}-${optIndex}`}
                className={`option-button ${
                  submitted
                    ? q.correctAnswer.includes(opt)
                      ? "correct"
                      : answers[index]?.includes(opt)
                        ? "incorrect"
                        : "disabled"
                    : answers[index]?.includes(opt)
                      ? "selected"
                      : ""
                }`}
                onClick={() => handleAnswer(index, opt)}
                disabled={submitted}
              >
                {opt}
              </button>
            ))}
          </div>

          {submitted && (
            <p className="answer-feedback">
              {answers[index]?.some((ans) => !q.correctAnswer.includes(ans)) ? (
                <>
                  ✅ Correct Answer: <span className="correct-answer">{q.correctAnswer.join(", ")}</span>
                  <br />
                  ❌ Your Answer: <span className="incorrect-answer">{answers[index]?.join(", ") || "No Answer"}</span>
                </>
              ) : (
                <span className="all-correct">✅ Correct Answer!</span>
              )}
            </p>
          )}
        </div>
      ))}

      <button className="submit-button" onClick={submitQuiz} disabled={submitted}>
        Submit Quiz
      </button>
      <button  className="submit-button" onClick={()=>navigate(-1)} style={{background:"gray", marginLeft:"20px"}}>Back</button>
      {submitted && <h3 className="score">Score: {score}</h3>}
    </div>
  );
};

export default Quiz;
