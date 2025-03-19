# Quiz--App

Quiz App – Full Stack Application
🚀 Live Demo
https://quiz-app-delta-bay-16.vercel.app/

📂 Project Structure
This repository contains both the Frontend and Backend components of the Quiz App.

📦 Quiz-App
│-- 📂 frontend  (React.js)
│-- 📂 backend   (Node.js/Express)
│-- README.md


📜 Project Overview
This is a full-stack Quiz Application with both user and admin functionalities. Users can attempt quizzes, see their scores, and track progress, while the admin can manage leaderboards and user scores.


🎯 Features---

🌟 User Features
Select from available quizzes
Answer different types of questions (Single-choice, Multiple-choice, True/False)
Get real-time feedback on answers
Progress bar for quiz completion
View final score at the end of the quiz
Light/Dark mode toggle

🔑 Admin Features
View leaderboard with top user scores
View all users' quiz results
Can create a quiz
Admin login to access restricted functionalities

🛠️ Tech Stack
🔹 Frontend
React.js (Hooks, Functional Components)
React Router for navigation
CSS Modules for styling

🔹 Backend
Node.js with Express
MongoDB for database
JWT-based authentication for users & admins

🚀 Installation Guide
🖥️ Prerequisites
Make sure you have the following installed:
Node.js
MongoDB 

📦 Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/Ganesh-Chetti/Quiz--App.git
cd Quiz--App

2️⃣ Install Dependencies
Frontend Setup:
cd frontend
npm install

Backend Setup:
cd backend
npm install

3️⃣ Configure Environment Variables
Create a .env file in the backend directory and set up the following:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

4️⃣ Start the Application
Start Backend Server:
cd backend
npm run dev
Start Frontend:
cd frontend
npm run dev

The application should now be running on:
Frontend: http://localhost:5000
Backend: http://localhost:5000

👨‍💻 Admin Access
Admin users can log in and manage quiz scores.
Only authenticated users with admin privileges can access the leaderboard.

📌 Deployment
This project is deployed on Vercel. You can access the live version here:
🔗 Live Link:https://quiz-app-delta-bay-16.vercel.app/login


This project follows best practices and will be evaluated based on:
✔️ Functionality & adherence to requirements
✔️ Code structure & readability
✔️ UI/UX & responsiveness
✔️ Error handling & edge case management
✔️ Secure authentication & admin access

💡 Additional Enhancements
✅ Animations & UI Enhancements
✅ Responsive design for mobile & desktop
✅ Secure JWT authentication

Happy coding! 🚀🎉
