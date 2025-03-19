import { useState } from "react";
import QuizList from "./QuizList";

const Home = () => {
  const [progress, setProgress] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);

  const handleQuizProgress = (percentage) => {
    setProgress(percentage);
  };

  const startQuiz = () => {
    setIsQuizActive(true);
    setProgress(0);
  };

  return (
    <div className="home-container">
      <div className="p-4" style={{ alignItems: "center", textAlign: "center" }}>
        <h1>Welcome to the Quiz App</h1>
        <p>Choose a quiz from the list below to get started!</p>
        
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
