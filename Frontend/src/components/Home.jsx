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
      <div
        className="p-4"
        style={{ alignItems: "center", textAlign: "center" }}
      >
        <h1>🎉 Welcome to the Ultimate Quiz Challenge! 🎉</h1>
        <p>Are you ready to test your knowledge and challenge yourself? 🧠✨</p>
        <p>
          Pick a quiz from the list below and prove you're the ultimate
          master! 🚀
        </p>

        {isQuizActive && (
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <QuizList onStartQuiz={startQuiz} onQuizProgress={handleQuizProgress} />
      </div>
    </div>
  );
};

export default Home;
