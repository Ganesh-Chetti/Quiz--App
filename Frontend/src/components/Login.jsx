import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://quiz-app-back.vercel.app/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      localStorage.setItem("token", data.token); 
      localStorage.setItem("role", data.user.isAdmin ? "admin" : "user"); 
      localStorage.setItem("user", JSON.stringify(data.user)); 

      window.dispatchEvent(new Event("storage"));
      navigate(data.user.isAdmin ? "/admin" : "/");

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input name="username" type="text" placeholder="Username" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p>New user? <button className="register-button" onClick={() => navigate("/register/user")}>Register</button></p>
    </div>
  );
};

export default Login;
