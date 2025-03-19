import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminRegister.css";

const AdminRegister = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        ...formData,
        isAdmin: true, // Admin registration
      });
      alert(response.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="admin-register-container">
      <h2>Admin Registration</h2>
      <form onSubmit={handleSubmit} className="admin-register-form">
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit">Register</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <p>
        Already an admin? <button className="login-button" onClick={() => navigate("/login")}>Login</button>
      </p>
    </div>
  );
};

export default AdminRegister;
