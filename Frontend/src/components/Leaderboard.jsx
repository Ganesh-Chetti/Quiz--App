import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; 
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Leaderboard.css";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const isAdmin = localStorage.getItem("role") === "admin";
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      const response = await axios.get(
        "https://quiz-app-back.vercel.app/api/leaderboard",
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      setLeaderboard(response.data);
    } catch (error) {
      toast.error("Error fetching leaderboard!");
    }
  };

  const handleDeleteScore = async (id) => {
    if (!id) {
      toast.error("Invalid score ID!");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const storedToken = localStorage.getItem("token");
          await axios.delete(
            `https://quiz-app-back.vercel.app/api/delete-score/${id}`,
            {
              headers: { Authorization: `Bearer ${storedToken}` },
            }
          );

          toast.success("Score deleted successfully!");
          fetchLeaderboard();
        } catch (error) {
          toast.error("Failed to delete score.");
        }
      }
    });
  };

  const handleEditScore = async (id, currentScore) => {
    const { value: newScore } = await Swal.fire({
      title: "Edit Score",
      input: "number",
      inputLabel: "Enter the new score",
      inputValue: currentScore,
      showCancelButton: true,
      confirmButtonText: "Save",
      inputValidator: (value) => {
        if (!value || isNaN(value) || value < 0) {
          return "Please enter a valid positive number.";
        }
      },
    });

    if (!newScore) return;

    try {
      const storedToken = localStorage.getItem("token");
      await axios.put(
        `https://quiz-app-back.vercel.app/api/edit-score/${id}`,
        { newScore: parseInt(newScore, 10) },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      toast.success("Score updated successfully!");
      fetchLeaderboard();
    } catch (error) {
      toast.error("Failed to update score.");
    }
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/admin"); // Fallback URL
    }
  };

  return (
    <div className="leaderboard-container">
      <div className="top-bar">
        <h2>Leaderboard</h2>
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
      </div>

      {leaderboard.length === 0 ? (
        <p>No scores available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Quiz Title</th>
              <th>Score</th>
              {isAdmin && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr key={entry._id}>
                <td className="tdname">{entry.username}</td>
                <td className="tdname">{entry.quizTitle}</td>
                <td className="tdname">{entry.score}</td>
                {isAdmin && (
                  <td>
                    <button
                      onClick={() => handleEditScore(entry._id, entry.score)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteScore(entry._id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Leaderboard;
