# 🚀 CodeX – DSA Learning & Competitive Coding Platform

> A full-stack coding platform inspired by **LeetCode**, **GeeksforGeeks**, and **W3Schools**, designed to help students learn Data Structures & Algorithms, solve coding problems, take quizzes, follow structured study plans, and get AI-powered assistance—all in one place.

![Node.js](https://img.shields.io/badge/Node.js-Runtime-green?logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Overview

**CodeX** is a comprehensive learning platform built for students preparing for coding interviews and competitive programming.

The platform combines structured DSA tutorials, coding challenges, quizzes, study plans, notes, and an AI assistant to provide a complete learning experience.

Whether you're just starting with DSA or preparing for technical interviews, CodeX helps you learn, practice, and improve—all from a single platform.

---

## ✨ Features

### 📚 DSA Learning

- Structured DSA learning paths
- Beginner-friendly explanations
- Topics like Arrays, Strings, Trees, Graphs, Dynamic Programming, and more
- Clean interface inspired by GeeksforGeeks and W3Schools

### 💻 Coding Problems

- Hundreds of DSA problems
- Easy & Medium difficulty levels
- Multi-language code editor
- Default code templates
- Multiple hidden test cases
- Online code execution using a Remote Compiler API

### 🧪 Quizzes

- Topic-wise MCQ quizzes
- Instant score calculation
- Performance evaluation
- Great for revision

### 📅 Study Plan

- Auto-generated study roadmap
- Topic-wise problem recommendations
- Organized learning progression

### 👤 User Management

- Secure Login & Registration
- Session-based Authentication
- Personalized User Profile
- Activity Tracking

### 📝 Personal Todo List

- Daily learning goals
- Track pending tasks
- Improve study consistency

### 🤖 AI Assistant

- Powered by Google Gemini API
- Session-based chat history
- DSA explanations
- Coding guidance
- Concept clarification

### 📒 Notes Library

- Topic-wise downloadable notes
- Revision material
- User-friendly organization

---

## 🏗️ Project Structure

```text
CodeX-DSA-Learning-Platform/
│
├── node_modules/
│
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── notes/
│
├── views/
│   ├── auth/
│   ├── partials/
│   ├── studyplan/
│   ├── codexAi.ejs
│   ├── dsa_topic.ejs
│   ├── home.ejs
│   ├── problems.ejs
│   ├── problem_detail.ejs
│   ├── profile.ejs
│   ├── quiz.ejs
│   ├── quiz_list.ejs
│   ├── start-dsa.ejs
│   └── todolist.ejs
│
├── .env
├── .gitignore
├── db.js
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Backend Framework |
| PostgreSQL | Database |
| EJS | Template Engine |
| HTML, CSS, Bootstrap | Frontend UI |
| Google Gemini API | AI Assistant |
| Remote Compiler API | Online Code Execution |
| bcrypt | Password Hashing |
| express-session | Authentication |
| dotenv | Environment Variables |

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sujit1661/CodeX.git
cd CodeX
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000
SESSION_SECRET=your_session_secret
DATABASE_URL=your_postgresql_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

---

### 4. Start the Application

```bash
node server.js
```

Or, if using Nodemon:

```bash
nodemon server.js
```

---

### 5. Open in Browser

```
http://localhost:3000
```

---

## 💬 Platform Highlights

Some of the major capabilities include:

- Learn Data Structures & Algorithms
- Solve coding challenges
- Execute code online
- Practice quizzes
- Follow structured study plans
- Save personal notes
- Manage daily learning tasks
- Get AI-powered coding assistance
- Track learning progress

---

## 🔒 Security

The platform follows standard security practices.

- ✅ Password hashing using bcrypt
- ✅ Session-based authentication
- ✅ Environment variables for secrets
- ✅ Secure PostgreSQL integration
- ✅ Protected user-specific data

---

## 🚀 Future Improvements

- Code submission history
- Leaderboards & coding streaks
- Problem discussion forum
- Dark Mode
- Admin Dashboard
- Email Verification
- Progress Analytics
- Contest Support
- Achievement Badges
- Docker Deployment

---

## 👨‍💻 Author

**Sujit Sadalage**

**B.Tech in Artificial Intelligence & Data Science (2022–2026)**

Aspiring **AI Engineer | Backend Developer | Python Developer**

- GitHub: https://github.com/sujit1661

---

## ⭐ Support

If you found this project helpful, consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and motivates future improvements.

---

## 📄 License

This project is intended for learning and educational purposes. Feel free to fork, modify, and build upon it.
