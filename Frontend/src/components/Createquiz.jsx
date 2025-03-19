import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/CreateQuiz.css";

const CreateQuiz = () => {
  const [quizData, setQuizData] = useState({
    title: "",
    questions: [
      {
        question: "",
        type: "single",
        options: ["", "", "", ""],
        correctAnswer: [],
      },
    ],
  });

  const [existingQuizzes, setExistingQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const response = await axios.get("https://quiz-app-back.vercel.app/api/quizzes", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setExistingQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizzes();
  }, []);

  const handleTitleChange = (e) => {
    setQuizData({ ...quizData, title: e.target.value });
  };

  const handleQuestionChange = (e, qIndex) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].question = e.target.value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleTypeChange = (e, qIndex) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].type = e.target.value;

    if (e.target.value === "true_false") {
      updatedQuestions[qIndex].options = ["True", "False"];
      updatedQuestions[qIndex].correctAnswer = ["True"]; 
    } else {
      updatedQuestions[qIndex].options = ["", "", "", ""];
      updatedQuestions[qIndex].correctAnswer = [];
    }

    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionChange = (e, qIndex, oIndex) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].options[oIndex] = e.target.value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleCorrectAnswerChange = (e, qIndex, option) => {
    const updatedQuestions = [...quizData.questions];

    if (updatedQuestions[qIndex].type === "multiple") {
      const updatedAnswers = updatedQuestions[qIndex].correctAnswer.includes(option)
        ? updatedQuestions[qIndex].correctAnswer.filter((ans) => ans !== option)
        : [...updatedQuestions[qIndex].correctAnswer, option];

      updatedQuestions[qIndex].correctAnswer = updatedAnswers;
    } else {
      updatedQuestions[qIndex].correctAnswer = [option];
    }

    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          question: "",
          type: "single",
          options: ["", "", "", ""],
          correctAnswer: [],
        },
      ],
    });
  };

  const removeQuestion = (qIndex) => {
    setQuizData({
      ...quizData,
      questions: quizData.questions.filter((_, index) => index !== qIndex),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedToken = localStorage.getItem("token");

    const existingQuiz = existingQuizzes.find(
      (quiz) => quiz.title.toLowerCase() === quizData.title.toLowerCase()
    );

    try {
      if (existingQuiz) {
        const response = await axios.get(
          `https://quiz-app-back.vercel.app/api/quizzes/${existingQuiz._id}`,
          { headers: { Authorization: `Bearer ${storedToken}` } }
        );

        if (!response.data.questions) {
          console.error("Existing quiz does not contain questions.");
          alert("Error: Existing quiz structure is invalid.");
          return;
        }

        const updatedQuestions = [...response.data.questions, ...quizData.questions];

        await axios.put(
          `https://quiz-app-back.vercel.app/api/update-quiz/${existingQuiz._id}`,
          { title: existingQuiz.title, questions: updatedQuestions },
          { headers: { Authorization: `Bearer ${storedToken}` } }
        );

        alert("Quiz updated successfully!");
      } else {
        await axios.post("https://quiz-app-back.vercel.app/api/add-quiz", quizData, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        alert("Quiz added successfully!");
      }
      navigate("/quizzes");
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz.");
    }
  };

  return (
    <div className="create-quiz-container">
      <h2>Create Quiz</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" className="inputtext" value={quizData.title} onChange={handleTitleChange} required />

        {quizData.questions.map((q, qIndex) => (
          <div key={qIndex} className="question-container">
            <label>Question {qIndex + 1}:</label>
            <input type="text" className="inputtext" value={q.question} onChange={(e) => handleQuestionChange(e, qIndex)} required />

            <label>Question Type:</label>
            <select value={q.type} onChange={(e) => handleTypeChange(e, qIndex)}>
              <option value="single">Single Choice</option>
              <option value="multiple">Multiple Choice</option>
              <option value="true_false">True/False</option>
            </select>

            {q.options.map((option, oIndex) => (
              <div key={oIndex}>
                <label>Option {oIndex + 1}:</label>
                <input type="text" className="inputtext" value={option} onChange={(e) => handleOptionChange(e, qIndex, oIndex)} required />
              </div>
            ))}

            <label>Correct Answer:</label>
            {q.type === "multiple" ? (
              <div>
                {q.options.map((option, oIndex) => (
                  <label key={oIndex}>
                    <input
                      type="checkbox"
                      value={option}
                      checked={q.correctAnswer.includes(option)}
                      onChange={(e) => handleCorrectAnswerChange(e, qIndex, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            ) : (
              <select value={q.correctAnswer[0] || ""} onChange={(e) => handleCorrectAnswerChange(e, qIndex, e.target.value)}>
                <option value="" disabled>Select correct answer</option>
                {q.options.map((option, oIndex) => (
                  <option key={oIndex} value={option}>{option}</option>
                ))}
              </select>
            )}

            {quizData.questions.length > 1 && (
              <button type="button" onClick={() => removeQuestion(qIndex)}>Remove Question</button>
            )}
          </div>
        ))}

        <button type="button" onClick={addQuestion}>Add Question</button>
        <button type="submit">Submit Quiz</button>
      </form>
    </div>
  );
};

export default CreateQuiz;
