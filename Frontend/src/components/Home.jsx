import { useState } from "react";
import QuizList from "./QuizList";
// import "../styles/Home.css";

const Home = () => {
  const [progress, setProgress] = useState(0); // Progress state (0-100)
  const [isQuizActive, setIsQuizActive] = useState(false);

  // Function to update progress from Quiz component
  const handleQuizProgress = (percentage) => {
    setProgress(percentage);
  };

  // Function to start the quiz
  const startQuiz = () => {
    setIsQuizActive(true);
    setProgress(0);
  };

  return (
    <div className="home-container">
      <div className="p-4" style={{ alignItems: "center", textAlign: "center" }}>
        <h1>Welcome to the Quiz App</h1>
        <p>Choose a quiz from the list below to get started!</p>
        
        {/* Progress Bar (Shown only when a quiz is active) */}
        {isQuizActive && (
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          
        )}

        <QuizList onStartQuiz={startQuiz} onQuizProgress={handleQuizProgress} />
      </div>
    </div>
  );
};

export default Home;
