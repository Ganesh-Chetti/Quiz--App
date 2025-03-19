import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import "../styles/Leaderboard.css";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const isAdmin = localStorage.getItem("role") === "admin";

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/leaderboard", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const handleDeleteScore = async (id) => {
    if (!id) {
      Swal.fire("Error", "Invalid score ID!", "error");
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
          const response = await axios.delete(`http://localhost:5000/api/delete-score/${id}`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });

          Swal.fire("Deleted!", response.data.message, "success");
          fetchLeaderboard();
        } catch (error) {
          console.error("Error deleting score:", error);
          Swal.fire("Error", error.response?.data?.message || "Failed to delete score.", "error");
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
      const response = await axios.put(
        `http://localhost:5000/api/edit-score/${id}`,
        { newScore: parseInt(newScore, 10) },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      Swal.fire("Success", response.data.message, "success");
      fetchLeaderboard();
    } catch (error) {
      console.error("Error updating score:", error);
      Swal.fire("Error", error.response?.data?.message || "Failed to update score.", "error");
    }
  };

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
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
                <td>{entry.username}</td>
                <td>{entry.quizTitle}</td>
                <td>{entry.score}</td>
                {isAdmin && (
                  <td>
                    <button onClick={() => handleEditScore(entry._id, entry.score)} className="edit-btn">
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteScore(entry._id)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
