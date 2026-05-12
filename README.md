# 🎓 AI Study Planner

A full-stack AI-powered study application built with React (Vite), Node.js/Express, MySQL, Clerk Auth, and Google Gemini.

---

## 📦 Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) v18 or higher
- [MySQL](https://www.mysql.com/) 8.0 or higher
- A [Clerk](https://clerk.com) account (free)
- A [Google Gemini](https://ai.google.dev) API key

---

## 🚀 Quick Setup

### Step 1: Database Setup

1. Open MySQL Workbench or terminal
2. Run the SQL file:
   ```sql
   source /path/to/ai-study-planner/database.sql
   ```
   Or paste the contents of `database.sql` into your MySQL client.

---

### Step 2: Clerk Setup

1. Go to [clerk.com](https://clerk.com) and create a free account
2. Create a new Application
3. Go to **API Keys** in the Clerk dashboard
4. Copy:
   - `Publishable Key` (starts with `pk_test_...`) → for frontend
   - `Secret Key` (starts with `sk_test_...`) → for backend

---

### Step 3: Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in:
```
GEMINI_API_KEY=your-gemini-api-key
CLERK_SECRET_KEY=sk_test_your-clerk-secret-key
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_NAME=ai_study_planner
FRONTEND_URL=http://localhost:5173
```

Then install and run:
```bash
npm install
npm run dev
```

Backend runs on: **http://localhost:5000**

---

### Step 4: Frontend Setup

```bash
cd frontend
cp .env.example .env
```

Edit `.env` and fill in:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key
VITE_API_URL=http://localhost:5000
```

Then install and run:
```bash
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

## 🌐 Access the App

Open your browser and go to: **http://localhost:5173**

---

## 📁 Project Structure

```
ai-study-planner/
├── frontend/                 # React (Vite) frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── SummaryPage.jsx
│   │   │   ├── TestPage.jsx
│   │   │   ├── ResultPage.jsx
│   │   │   └── HistoryPage.jsx
│   │   ├── components/       # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── utils/
│   │   │   └── api.js        # Axios API client
│   │   ├── App.jsx           # Router setup
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node.js + Express API
│   ├── routes/
│   │   ├── summary.js        # POST /api/summary
│   │   ├── quiz.js           # POST /api/quiz
│   │   ├── qna.js            # POST /api/qna
│   │   ├── evaluate.js       # POST /api/evaluate
│   │   └── history.js        # GET /api/history
│   ├── middleware/
│   │   └── auth.js           # Clerk JWT verification
│   ├── db.js                 # MySQL connection
│   ├── server.js             # Express server
│   └── package.json
│
└── database.sql              # MySQL schema
```

---

## 🔌 API Endpoints

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| POST   | /api/summary          | Generate AI notes summary      |
| POST   | /api/quiz             | Generate MCQ questions         |
| POST   | /api/qna              | Generate Q&A questions         |
| POST   | /api/evaluate         | Evaluate test answers          |
| GET    | /api/history          | Fetch user test history        |
| GET    | /api/history/:testId  | Get specific test details      |
| GET    | /api/history/stats    | Get user statistics            |
| GET    | /api/health           | Health check                   |

---

## 🔑 Features

- ✅ **Clerk Authentication** - Secure signup/login with protected routes
- ✅ **OCR** - Upload image notes → Tesseract.js extracts text
- ✅ **PDF parsing** - Extract text from PDF documents
- ✅ **AI Summaries** - Bullet-point summaries with key revision points
- ✅ **MCQ Tests** - AI-generated multiple choice questions
- ✅ **Q&A Tests** - Written answers evaluated by AI
- ✅ **Score & Feedback** - Detailed AI feedback with improvement tips
- ✅ **Test History** - MySQL storage with charts
- ✅ **Dark Mode UI** - Modern dark theme with animations

---

## ⚙️ Common Issues

**MySQL connection fails:**
- Make sure MySQL service is running
- Check credentials in `backend/.env`
- Ensure `ai_study_planner` database exists

**Clerk auth fails:**
- Make sure keys match (publishable → frontend, secret → backend)
- Check that the frontend URL is in Clerk's allowed origins

**OpenAI errors:**
- Verify your API key is valid
- Check you have credits/quota available

**OCR is slow:**
- Tesseract downloads language data on first run (~30s)
- Subsequent runs are faster

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Framer Motion       |
| Backend    | Node.js, Express                    |
| Database   | MySQL 8 with mysql2                 |
| Auth       | Clerk                               |
| AI         | OpenAI GPT-3.5-turbo               |
| OCR        | Tesseract.js                        |
| Styling    | Custom CSS (no UI framework)        |
| Charts     | Recharts                            |
