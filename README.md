# CodeX 🚀

**CodeX** is a full‑stack DSA learning and competitive coding platform inspired by LeetCode, GeeksforGeeks, and W3Schools. It combines structured DSA learning paths, coding problems with an online compiler, quizzes, study plans, user profiles, and an AI assistant — all in one place.

---

## 🔥 Features

### 🧠 DSA Learning Platform

* Topic‑wise DSA content (Arrays, Strings, Searching, Sorting, Trees, etc.)
* Clean learning paths similar to GeeksforGeeks / W3Schools
* Beginner‑friendly explanations

### 💻 Coding Problems (LeetCode‑style)

* Hundreds of DSA problems stored in PostgreSQL
* Difficulty levels: Easy / Medium
* Multi‑language support (Python, Java, C, C++, JavaScript, etc.)
* Default code templates + 15–20 test cases per problem
* Online code execution using a remote compiler API

### 🧪 Quizzes

* Topic‑wise MCQ quizzes
* Instant score calculation
* Useful for revision & self‑assessment

### 📊 Study Plan

* Auto‑generated study plans from problem topics
* Topic‑wise problem listing

### 👤 User System

* Secure authentication (Login / Register)
* Session‑based auth using `express-session`
* Profile page with activity stats

### 📝 Todo List

* Personal task manager for daily study goals

### 🤖 AI Assistant (Gemini)

* Built‑in AI assistant using **Google Gemini API**
* Maintains chat history per session
* Helps with DSA doubts, explanations, and guidance

---

## 🛠 Tech Stack

**Frontend**

* EJS
* HTML, CSS, Bootstrap

**Backend**

* Node.js
* Express.js

**Database**

* PostgreSQL

**Authentication & Security**

* bcrypt (password hashing)
* express‑session
* dotenv

**APIs & Integrations**

* Remote Code Execution API
* Google Gemini AI

---

## 📂 Project Structure

```bash
project/
│── app.js
│── db.js
│── .env
│── public/
│── views/
│   ├── auth/
│   ├── studyplan/
│   ├── quiz/
│   ├── profile.ejs
│   ├── problems.ejs
│   └── codexAi.ejs
│── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=3000
SESSION_SECRET=your_session_secret
DATABASE_URL=postgres_connection_url
GEMINI_API_KEY=your_gemini_api_key
```

---

## ▶️ Run Locally

```bash
npm install
node app.js
```

Open:

```
http://localhost:3000
```

---

## 🎯 Future Improvements

* Code submission tracking
* Problem discussion section
* Leaderboard & streaks
* Dark mode
* Admin dashboard

---

## 🙌 Author

**Sujit**
Passionate about Full‑Stack Development, DSA, and AI‑powered learning platforms.

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub — it really helps!
