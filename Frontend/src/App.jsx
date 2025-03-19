import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import Admin from "./components/Admin";
import Login from "./components/Login";
import Quiz from "./components/Quiz";
import Navbar from "./components/Navbar";
import CreateQuiz from "./components/Createquiz"; 
import Quizzes from "./components/Quizzes";        
import Leaderboard from "./components/Leaderboard";
import UserRegister from "./components/UserRegister";
import AdminRegister from "./components/AdminRegister";

const isAuthenticated = () => {
  const token = localStorage.getItem("token"); 
  return !!token; 
};

function ProtectedRoute({ element }) {
  return isAuthenticated() ? element : <Navigate to="/login" />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    const handleAuthChange = () => setIsLoggedIn(isAuthenticated());
    window.addEventListener("storage", handleAuthChange);
    return () => window.removeEventListener("storage", handleAuthChange);
  }, []);

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
} else {
  document.body.classList.add("light-mode");
}


  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register/user" element={<UserRegister />} />
        <Route path="/register/admin" element={<AdminRegister />} />

        {/* Protected Routes (Require Token) */}
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />
        <Route path="/quiz/:id" element={<ProtectedRoute element={<Quiz />} />} />
        <Route path="/create-quiz" element={<ProtectedRoute element={<CreateQuiz />} />} />
        <Route path="/quizzes" element={<ProtectedRoute element={<Quizzes />} />} />
        <Route path="/leaderboard" element={<ProtectedRoute element={<Leaderboard />} />} />

        {/* Redirect all unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
