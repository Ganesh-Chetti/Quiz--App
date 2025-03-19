
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

const Admin = () => {
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    if (tab === "createQuiz") {
      navigate("/create-quiz"); 
    } else if (tab === "quizzes") {
      navigate("/quizzes"); 
    } else if (tab === "leaderboard") {
      navigate("/leaderboard");
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <div className="admin-nav">
      <button onClick={() => handleTabChange("createQuiz")}>Create Quiz</button>
      <button onClick={() => handleTabChange("quizzes")}>Quizzes</button>
      <button onClick={() => handleTabChange("leaderboard")}>Leaderboard</button>
    </div>
    </div>
  );
};

export default Admin;
