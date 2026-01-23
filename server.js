import session from 'express-session';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch'; // Needed for Judge0 API
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();



const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;
app.use(express.urlencoded({ extended: true }));


// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);




app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }  // 1 day store session
}));



// Set EJS view engine and views directory
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.set('views', path.join(__dirname, 'views'));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Homepage route
app.get('/', (req, res) => {
  res.render('home'); // views/home.ejs
});


// All problems list page
app.get('/problems', ensureAuthenticated ,async (req, res) => {
  if (!req.session.user) return res.redirect('/auth'); // ✅ ensure user is logged in

  const problems = await pool.query('SELECT * FROM problems1 ORDER BY number');
  const userQuery = await pool.query('SELECT * FROM users WHERE id = $1', [req.session.user.id]);
  const user = userQuery.rows[0];

  res.render('problems', {
    problems1: problems.rows,
    user: user // ✅ now passed to problems.ejs
  });
});



// ✅ GET route for login/signup page (fixed path)
app.get('/auth' ,(req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'auth', 'login.html'));
});



//for register
app.post("/register" ,async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashed]
    );
    res.redirect("/auth");
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).send("Email already exists or registration failed.");
  }
});


//for login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).sendFile(path.join(__dirname, 'views', 'auth', 'login_failed.html'));
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).sendFile(path.join(__dirname, 'views', 'auth', 'login_failed.html'));
    }

    // Login success
    req.session.user = { id: user.id, name: user.name, email: user.email };

    // ✅ Redirect to the originally intended route if it exists
    const redirectTo = req.session.redirectAfterLogin || '/problems';
    delete req.session.redirectAfterLogin; // Clear after use
    res.redirect(redirectTo);

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).send("Login failed");
  }
});




// Middleware to protect authenticated routes
function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }

  // Save the original URL to session before redirecting
  req.session.redirectAfterLogin = req.originalUrl;
  return res.redirect('/auth');
}


//for logout
app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Logout failed");
    }
    res.clearCookie("connect.sid"); // Clear session cookie
    res.redirect("/"); // Redirect to home after logout
  });
});



// PROFILE PAGE ROUTE
app.get('/profile', ensureAuthenticated ,async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const userId = req.session.user.id;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

    if (rows.length === 0) {
      return res.status(404).send('User not found');
    }
    const user = rows[0];

    // Fallback values for safety
    user.total_solved = user.solutions || 0;
    user.attempting = user.views || 0;
    user.java_solved = user.solutions || 0;
    user.total_submissions = (user.views || 0) + (user.solutions || 0);
    res.render('profile', { user });
  } catch (err) {
    console.error('Error loading profile:', err);
    res.status(500).send('Internal Server Error');
  }
});



// ✅ Route to load the topic using slug
app.get('/learning-paths/:slug', ensureAuthenticated ,async (req, res) => {
  const { slug } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM dsa_content WHERE topic_slug = $1',
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Topic not found');
    }

    res.render('dsa_topic', { data: result.rows[0] });
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


// get start-dsa page
app.get('/start-dsa', ensureAuthenticated ,(req, res) => {
  res.render('start-dsa'); // EJS view
});



// Individual problem detail page
app.get('/problems/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM problems1 WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Problem not found');
    }

    const problem = result.rows[0];

    // ✅ SAFELY parse JSON fields if needed
    const defaultCode = typeof problem.default_code_json === 'string'
      ? JSON.parse(problem.default_code_json)
      : problem.default_code_json;

    const testCases = typeof problem.test_cases_json === 'string'
      ? JSON.parse(problem.test_cases_json)
      : problem.test_cases_json;

    res.render('problem_detail', {
      problem,
      defaultCode,
      testCases
    });
  } catch (err) {
    console.error('❌ Error fetching problem:', err);
    res.status(500).send('Internal Server Error');
  }
});


//for the compiler which are using remote compile execution
// Add this middleware at the top of your server file
app.use(express.json()); // required for JSON body parsing
// Your /run route
app.post("/run", async (req, res) => {
  const { source_code, stdin, language_id } = req.body;

  if (!source_code || !language_id) {
    return res.status(400).json({ error: "Missing source_code or language_id" });
  }

  const langMap = {
    71: "python", 62: "java", 54: "cpp", 50: "c", 63: "javascript",
    74: "typescript", 72: "ruby", 46: "bash", 60: "go", 73: "rust"
  };

  const lang = langMap[language_id];

  if (!lang) return res.status(400).json({ error: "Unsupported language ID" });

  try {
    const resp = await fetch(`https://apiforcode.dailywith.me/api/v1/compile/${lang}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: source_code,
        stdin: stdin || ""
      })
    });

    const data = await resp.json();

    if (data.stderr?.length) {
      return res.json({ stderr: data.stderr.map(e => e.text).join('\n') });
    }

    return res.json({ stdout: data.stdout.map(e => e.text).join('') });
  } catch (err) {
    console.error("❌ Error in /run:", err);
    res.status(500).json({ error: "Execution failed" });
  }
});




// Quiz list page
app.get("/quizzes", ensureAuthenticated ,async (req, res) => {
  try {
    const result = await pool.query("SELECT DISTINCT topic_slug FROM dsa_quizzes ORDER BY topic_slug");
    res.render("quiz_list", { quizzes: result.rows });
  } catch (err) {
    console.error("❌ Quiz list DB error:", err);
    res.status(500).send("Internal Server Error");
  }
});


// Show quiz
app.get("/quiz/:slug", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM dsa_quizzes WHERE topic_slug = $1", [req.params.slug]);
    if (result.rows.length === 0) return res.status(404).send("Quiz not found");
    res.render("quiz", { topic: req.params.slug, questions: result.rows, score: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading quiz");
  }
});


// Handle submission
app.post("/quiz/:slug/submit", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM dsa_quizzes WHERE topic_slug = $1", [req.params.slug]);
    const questions = result.rows.map(q => ({
      ...q,
      userAnswer: req.body[`q${q.id}`]
    }));

    let score = 0;
    questions.forEach(q => {
      if (q.userAnswer === q.correct_option) score++;
    });

    res.render("quiz", {
      topic: req.params.slug,
      questions,
      score
    });
  } catch (err) {
    console.error("❌ Quiz submission error:", err);
    res.status(500).send("Internal Server Error");
  }
});



// ✅ CodeX TodoList Routes
app.get("/todo", ensureAuthenticated,async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todo ORDER BY id");
    res.render("todolist", {
      listTitle: "📋 Today's Tasks",
      listItems: result.rows
    });
  } catch (err) {
    console.error("❌ Todo DB error:", err);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/todo/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await pool.query("INSERT INTO todo (title) VALUES ($1)", [item]);
    res.redirect("/todo");
  } catch (err) {
    console.error("❌ Add Todo Error:", err);
    res.status(500).send("Error adding task");
  }
});

app.post("/todo/edit", async (req, res) => {
  const id = req.body.updatedItemId;
  const newTitle = req.body.updatedItemTitle;
  try {
    await pool.query("UPDATE todo SET title = $1 WHERE id = $2", [newTitle, id]);
    res.redirect("/todo");
  } catch (err) {
    console.error("❌ Edit Todo Error:", err);
    res.status(500).send("Error editing task");
  }
});

app.post("/todo/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await pool.query("DELETE FROM todo WHERE id = $1", [id]);
    res.redirect("/todo");
  } catch (err) {
    console.error("❌ Delete Todo Error:", err);
    res.status(500).send("Error deleting task");
  }
});

//to display study plan
app.get('/study_plan', async (req, res) => {
  const result = await pool.query(`
    SELECT topic, COUNT(*) AS count
    FROM problems1
    GROUP BY topic
    ORDER BY MIN(number)
  `);
  res.render('studyplan/study_plan', { topics: result.rows });
});


//to get each page question where the route contains :topic which replaces the specific topic form the table and route to that question
app.get('/study/:topic', async (req, res) => {
  const topic = req.params.topic;
  try {
    const { rows } = await pool.query(
      'SELECT id, number, title, difficulty FROM problems1 WHERE topic = $1 ORDER BY number ASC',
      [topic]
    );
    res.render('studyplan/topic_problems', { topic, problems: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading topic problems");
  }
});




// GET: Show Assistant UI
app.get('/ai', (req, res) => {
  const isEmbed = req.query.embed === 'true';
  res.render('codexAi', {
    chatHistory: req.session.chatHistory || [],
    isEmbed: isEmbed // ✅ pass this to EJS
  });
});

app.post('/ai', async (req, res) => {
  const prompt = req.body.prompt?.trim();
  if (!prompt) {
    return res.render('codexAi', {
      response: '⚠️ Please enter a prompt.',
      chatHistory: req.session.chatHistory || []
    });
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    // Initialize chat history array if not set
    req.session.chatHistory = req.session.chatHistory || [];
    // Add user's prompt to history
    req.session.chatHistory.push(prompt);
    // Generate AI response based on full text history
    const result = await model.generateContent(req.session.chatHistory);
    const response = result.response.text();
    // Add AI response to chat history
    req.session.chatHistory.push(response);
    res.render('codexAi', {
      chatHistory: req.session.chatHistory
    });
  } catch (err) {
    console.error('❌ Gemini AI error:', err);
    res.render('codexAi', {
      response: '❌ Something went wrong while talking to the AI.',
      chatHistory: req.session.chatHistory || []
    });
  }
});

//to display notes
app.get('/notes', (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect('/login');

  res.render('studyplan/notes', { user });
});



// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
