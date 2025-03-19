// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../styles/Admin.css";

// const Admin = () => {
//   const [activeTab, setActiveTab] = useState("createQuiz");
//   const [quizData, setQuizData] = useState({
//     title: "",
//     questions: [{ question: "", options: ["", "", "", ""], correctAnswer: "" }]
//   });
//   const [quizzes, setQuizzes] = useState([]);
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [selectedQuiz, setSelectedQuiz] = useState(null);
//   const [editingQuizId, setEditingQuizId] = useState(null);
//   const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
// const [editingQuestion, setEditingQuestion] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (!storedToken) {
//       navigate("/login");
//     } else {
//       setLoading(false);
//       fetchQuizzes(storedToken);
//       fetchLeaderboard(storedToken);
//     }
//   }, [navigate]);

//   const handleTitleChange = (e) => {
//     setQuizData({ ...quizData, title: e.target.value });
//   };

//   const startEditingQuestion = (question, qIndex) => {
//     setEditingQuestionIndex(qIndex);
//     setEditingQuestion({ ...question, options: [...question.options] }); // Ensure options exist
//   };
  
  
//   const cancelEditQuestion = () => {
//     setEditingQuestionIndex(null);
//     setEditingQuestion(null);
//   };
  


//   const handleQuestionChange = (e, field) => {
//     if (!editingQuestion) return; // Prevent errors
//     setEditingQuestion({ ...editingQuestion, [field]: e.target.value });
//   };
  
//   const handleOptionChange = (e, oIndex) => {
//     if (!editingQuestion) return; // Prevent errors
//     const updatedOptions = [...editingQuestion.options];
//     updatedOptions[oIndex] = e.target.value;
//     setEditingQuestion({ ...editingQuestion, options: updatedOptions });
//   };
  
  

//   const saveEditedQuestion = async (quizId, qIndex) => {
//     if (!editingQuestion || !editingQuestion.options) return; // Prevent saving if data is invalid
  
//     try {
//       const storedToken = localStorage.getItem("token");
//       const updatedQuiz = quizzes.find((q) => q._id === quizId);
//       updatedQuiz.questions[qIndex] = editingQuestion; // Update the question
  
//       await axios.put(`http://localhost:5000/update-quiz/${quizId}`, updatedQuiz, {
//         headers: { Authorization: `Bearer ${storedToken}` }
//       });
  
//       alert("Question updated successfully!");
//       fetchQuizzes(storedToken);
//       setEditingQuestionIndex(null);
//       setEditingQuestion(null);
//     } catch (error) {
//       console.error("Error updating question:", error);
//       alert("Failed to update question.");
//     }
//   };
  
  
  
//   const handleInputChange = (e, qIndex, field) => {
//     const value = e.target.value;
//     const updatedQuestions = [...quizData.questions];
//     updatedQuestions[qIndex][field] = value;
//     setQuizData({ ...quizData, questions: updatedQuestions });
//   };

//   // const handleOptionChange = (e, qIndex, oIndex) => {
//   //   const value = e.target.value;
//   //   const updatedQuestions = [...quizData.questions];
//   //   updatedQuestions[qIndex].options[oIndex] = value;
//   //   setQuizData({ ...quizData, questions: updatedQuestions });
//   // };

//   const addQuestion = () => {
//     setQuizData({
//       ...quizData,
//       questions: [...quizData.questions, { question: "", options: ["", "", "", ""], correctAnswer: "" }]
//     });
//   };

//   const handleDeleteQuestion = async (quizId, qIndex) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this question?");
//     if (!confirmDelete) return;
  
//     try {
//       const storedToken = localStorage.getItem("token");
//       const updatedQuiz = quizzes.find((q) => q._id === quizId);
//       updatedQuiz.questions.splice(qIndex, 1);
  
//       await axios.put(`http://localhost:5000/update-quiz/${quizId}`, updatedQuiz, {
//         headers: { Authorization: `Bearer ${storedToken}` }
//       });
  
//       alert("Question deleted successfully!");
//       fetchQuizzes(storedToken);
//     } catch (error) {
//       console.error("Error deleting question:", error);
//       alert("Failed to delete question.");
//     }
//   };
  

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     if (tab === "createQuiz") {
//       // Reset quiz form when switching to "Create Quiz"
//       setQuizData({
//         title: "",
//         questions: [{ question: "", options: ["", "", "", ""], correctAnswer: "" }]
//       });
//       setEditingQuizId(null); // Ensure it's not in editing mode
//     }
//   };
  
  

//   const removeQuestion = (qIndex) => {
//     if (window.confirm("Are you sure you want to delete this question?")) {
//       const updatedQuestions = quizData.questions.filter((_, index) => index !== qIndex);
//       setQuizData({ ...quizData, questions: updatedQuestions });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const storedToken = localStorage.getItem("token");
  
//     if (!quizData.title.trim()) {
//       alert("Quiz title is required.");
//       return;
//     }
  
//     const formattedQuestions = quizData.questions.map(q => ({
//       question: q.question.trim(),
//       options: q.options.filter(opt => opt.trim() !== ""),
//       correctAnswer: q.correctAnswer.trim()
//     }));
  
//     for (const q of formattedQuestions) {
//       if (!q.question || q.options.length < 2 || !q.correctAnswer) {
//         alert("Each question must have text, at least two options, and a correct answer.");
//         return;
//       }
//     }
  
//     try {
//       if (editingQuizId) {
//         // ✅ If editing, update quiz
//         await axios.put(`http://localhost:5000/update-quiz/${editingQuizId}`, {
//           title: quizData.title,
//           questions: formattedQuestions
//         }, {
//           headers: { Authorization: `Bearer ${storedToken}` }
//         });
  
//         alert("Quiz updated successfully!");
//       } else {
//         // ✅ If creating new quiz
//         await axios.post("http://localhost:5000/add-quiz", {
//           title: quizData.title,
//           questions: formattedQuestions
//         }, {
//           headers: { Authorization: `Bearer ${storedToken}` }
//         });
  
//         alert("Quiz added successfully!");
//       }
  
//       setQuizData({ title: "", questions: [{ question: "", options: ["", "", "", ""], correctAnswer: "" }] });
//       setEditingQuizId(null); // Reset editing state
//       fetchQuizzes(storedToken);
//     } catch (error) {
//       console.error("Error saving quiz:", error.response?.data || error.message);
//       setError("An error occurred while saving the quiz.");
//     }
//   };
  

//   const fetchQuizzes = async (storedToken) => {
//     try {
//       const response = await axios.get("http://localhost:5000/quizzes", {
//         headers: { Authorization: `Bearer ${storedToken}` }
//       });
//       setQuizzes(response.data);
//     } catch (error) {
//       console.error("Error fetching quizzes:", error);
//       setError("Failed to load quizzes.");
//     }
//   };

//   const fetchLeaderboard = async (storedToken) => {
//     try {
//       const response = await axios.get("http://localhost:5000/leaderboard", {
//         headers: { Authorization: `Bearer ${storedToken}` }
//       });
//       setLeaderboard(response.data);
//     } catch (error) {
//       console.error("Error fetching leaderboard:", error);
//       setError("Failed to load leaderboard.");
//     }
//   };

//   const resetUserScore = async (userId) => {
//     try {
//       const storedToken = localStorage.getItem("token");
//       await axios.post(
//         `http://localhost:5000/reset-score/${userId}`,
//         {},
//         { headers: { Authorization: `Bearer ${storedToken}` } }
//       );
//       alert("User score reset successfully!");
//       fetchLeaderboard(storedToken);
//     } catch (error) {
//       console.error("Error resetting score:", error);
//       setError("Failed to reset score.");
//     }
//   };

//   const handleEditQuiz = (quiz) => {
//     setQuizData({
//       title: quiz.title,
//       questions: quiz.questions.map(q => ({
//         question: q.question,
//         options: [...q.options],
//         correctAnswer: q.correctAnswer
//       }))
//     });
//     setActiveTab("createQuiz"); // Switch to the Create/Edit Quiz tab
//     setEditingQuizId(quiz._id);
//   };
  

  
//   const handleDeleteQuiz = async (quizId) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this quiz?");
//     if (!confirmDelete) return;
  
//     try {
//       const storedToken = localStorage.getItem("token");
//       await axios.delete(`http://localhost:5000/delete-quiz/${quizId}`, {
//         headers: { Authorization: `Bearer ${storedToken}` }
//       });
//       alert("Quiz deleted successfully!");
//       fetchQuizzes(storedToken); // Refresh quiz list
//     } catch (error) {
//       console.error("Error deleting quiz:", error);
//       setError("Failed to delete quiz.");
//     }
//   };
  

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="admin-container">
//       <h2>Admin Dashboard</h2>

//       <div className="admin-nav">
//       <button onClick={() => handleTabChange("createQuiz")}>Create Quiz</button>
//         <button onClick={() => setActiveTab("quizzes")}>Quizzes</button>
//         <button onClick={() => setActiveTab("leaderboard")}>Leaderboard</button>
//       </div>

//       {error && <div className="error-message">{error}</div>}

//       {activeTab === "createQuiz" && (
//         <div className="card">
//           <h3>Create New Quiz</h3>
//           <form onSubmit={handleSubmit}>
//             <label>Title:</label>
//             <input type="text" value={quizData.title} onChange={handleTitleChange} required />
//             {quizData.questions.map((q, qIndex) => (
//   <div key={qIndex} className="question-container">
//     <hr />
//     <label>Question {qIndex + 1}:</label>
//     <input
//       type="text"
//       value={q.question}
//       onChange={(e) => handleInputChange(e, qIndex, "question")}
//       required
//     />

//     {q.options.map((option, oIndex) => (
//       <div key={oIndex}>
//         <label>Option {oIndex + 1}:</label>
//         <input
//           type="text"
//           value={option}
//           onChange={(e) => handleOptionChange(e, qIndex, oIndex)}
//           required
//         />
//       </div>
//     ))}

//     <label>Correct Answer:</label>
//     <select
//       value={q.correctAnswer}
//       onChange={(e) => handleInputChange(e, qIndex, "correctAnswer")}
//       required
//     >
//       {q.options.map((option, oIndex) => (
//         <option key={oIndex} value={option}>
//           {option}
//         </option>
//       ))}
//     </select>

//     {quizData.questions.length > 1 && (
//       <button type="button" onClick={() => removeQuestion(qIndex)} className="remove-question-btn">
//         Remove Question
//       </button>
//     )}
//   </div>
// ))}

//             <button type="button" onClick={addQuestion}>Add Question</button>
//             <button type="submit">Submit Quiz</button>
//           </form>
//         </div>
//       )}

// {activeTab === "quizzes" && (
//   <div className="card">
//     <h3>Available Quizzes</h3>
//     {quizzes.map((quiz) => (
//       <div key={quiz._id} className="quiz-item">
//         <h4 
//           style={{ cursor: "pointer", color: "blue" }} 
//           onClick={() => setSelectedQuiz(selectedQuiz === quiz._id ? null : quiz._id)}
//         >
//           {quiz.title}
//         </h4>

//         {/* Buttons for Edit and Delete Quiz */}
//         <div className="quiz-actions">
//           <button onClick={() => handleEditQuiz(quiz)} className="edit-btn">Edit</button>
//           <button onClick={() => handleDeleteQuiz(quiz._id)} className="delete-btn">Delete</button>
//         </div>

//         {/* Show questions when quiz is selected */}
//         {selectedQuiz === quiz._id && (
//           <div>
//             {quiz.questions.map((q, qIndex) => (
//               <div key={qIndex} className="question-item">
//                 {editingQuestionIndex === qIndex ? (
//                   // ✅ Edit Mode for Question
//                   <div>
//                     <input 
//                       type="text" 
//                       value={editingQuestion.question} 
//                       onChange={(e) => handleQuestionChange(e, "question")}
//                     />
//                     {editingQuestion.options.map((option, oIndex) => (
//                       <div key={oIndex}>
//                         <input 
//                           type="text" 
//                           value={option} 
//                           onChange={(e) => handleOptionChange(e, oIndex)}
//                         />
//                       </div>
//                     ))}
//                     <select 
//                       value={editingQuestion.correctAnswer}
//                       onChange={(e) => handleQuestionChange(e, "correctAnswer")}
//                     >
//                       {editingQuestion.options.map((option, oIndex) => (
//                         <option key={oIndex} value={option}>{option}</option>
//                       ))}
//                     </select>
//                     <button onClick={() => saveEditedQuestion(quiz._id, qIndex)}>Save</button>
//                     <button onClick={() => cancelEditQuestion()}>Cancel</button>
//                   </div>
//                 ) : (
//                   // ✅ Normal View Mode for Question
//                   <div>
//                     <p>{qIndex + 1}. {q.question}</p>
//                     <ul>
//                       {q.options.map((option, oIndex) => (
//                         <li key={oIndex}>{option}</li>
//                       ))}
//                     </ul>
//                     <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
//                     <div className="quiz-actions">
//                       <button onClick={() => startEditingQuestion(q, qIndex)} className="edit-btn">Edit</button>
//                       <button onClick={() => handleDeleteQuestion(quiz._id, qIndex)} className="delete-btn">Delete</button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     ))}
//   </div>
// )}



//       {activeTab === "leaderboard" && (
//         <div className="card">
//           <h3>Leaderboard</h3>
//           <ul>{leaderboard.map((user) => <li key={user._id}>{user.username} - {user.score}</li>)}</ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Admin;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";
// import AdminNav from "../components/AdminNav";

const Admin = () => {
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    if (tab === "createQuiz") {
      navigate("/create-quiz"); // Navigate to Create Quiz page
    } else if (tab === "quizzes") {
      navigate("/quizzes"); // Navigate to Quizzes page
    } else if (tab === "leaderboard") {
      navigate("/leaderboard"); // Navigate to Leaderboard page
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
