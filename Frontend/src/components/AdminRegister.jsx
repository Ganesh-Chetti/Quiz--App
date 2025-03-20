import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/AdminRegister.css";

const AdminRegister = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://quiz-app-back.vercel.app/api/register", {
        ...formData,
        isAdmin: true,
      });

      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Registration failed. Try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      });
    }
  };

  return (
    <div className="admin-register-container">
      <h2>Admin Registration</h2>
      <ToastContainer />
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

      <p>
        Already an admin? <button className="login-button" onClick={() => navigate("/login")}>Login</button>
      </p>
    </div>
  );
};

export default AdminRegister;
