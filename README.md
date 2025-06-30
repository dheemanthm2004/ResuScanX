
# 🧠 ResuScanX

**AI-Powered Resume vs Job Description Analyzer + ATS Compatibility Checker**

[![Live Demo](https://img.shields.io/badge/Live_App-Vercel-000?style=for-the-badge&logo=vercel)](https://resuscanx.vercel.app)
[![API](https://img.shields.io/badge/API-Render-0A66C2?style=for-the-badge&logo=render)](https://resuscanx.onrender.com)

<p align="center">
  <img src="https://i.ibb.co/0y7QkrBJ/image.png" alt="ResuScanX Homepage Preview" width="800"/>
</p>

---

## 📌 Overview

**ResuScanX** is a smart web application that empowers job seekers by comparing their resume to any job description using **AI**, **NLP**, and **ATS simulation**. It delivers a realistic match score, identifies skill gaps, and gives actionable improvement tips — helping users improve their chances of getting shortlisted.

---

## ✨ Core Features

### 🧠 Resume vs JD Analyzer
- Upload a **PDF resume** and paste a **job description**
- AI computes a **match score**, skill fit, and missing areas
- Factors in **experience**, **education**, **seniority** gaps

### 📊 Skill Intelligence & Visual Analytics
- **NLP-based** skill extraction
- Interactive charts showing match/gap breakdown
- AI-powered **recommendations** for next steps

### ✅ ATS Compatibility Checker *(Public Tool)*
- Simulates how ATS parses your resume
- Checks for formatting, keyword, structure issues
- Generates **ATS score**, flags, and formatting suggestions

### 💬 AI Career Assistant
- Context-aware chat about your analysis
- Personalized **interview prep**, **skill advice**, and **resume tips**

### 📈 Authenticated Dashboard
- View resume analysis **history**
- Revisit and export full reports
- Built-in session management with JWT auth

---

## 🛠 Tech Stack

| Layer     | Stack                                    |
|-----------|------------------------------------------|
| Frontend  | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend   | Node.js, Express.js, MongoDB, Mongoose, JWT        |
| AI/NLP    | Gemini API, OpenRouter, Mistral, Cohere, `natural`, `compromise` |
| Parsing   | `pdf-parse`, `multer` for file handling   |
| Charts    | Chart.js + react-chartjs-2               |
| Auth      | JWT + bcryptjs                           |
| Hosting   | Vercel (frontend), Render (backend), MongoDB Atlas |

---

## 🧾 Project Structure

```

resuscanx/
├── backend/
│   ├── routes/       → auth, ats, analysis, chat
│   ├── models/       → User, Analysis schemas
│   ├── services/     → aiService.js, atsService.js
│   └── middleware/   → JWT auth middleware
│
├── frontend/
│   ├── app/          → Pages (dashboard, ats-checker, analysis, auth)
│   ├── components/   → ChatBot, Charts, ExportButton
│   ├── lib/          → API client config
│   └── types/        → Shared TS types

````

---

## 🧪 How It Works

1. **Upload resume** (PDF) and **paste JD**
2. AI extracts text and analyzes using:
   - Gemini (primary)
   - OpenRouter / Mistral / Cohere (fallbacks)
3. AI generates:
   - ✅ Match Score (0–100%)
   - 🧩 Skills Matched / Missing
   - 🎓 Education / Experience gap assessment
   - 📚 Personalized next steps
4. Bonus: ATS simulation for resume structure and keyword strength

---

## 📡 API Endpoints

| Method | Endpoint                     | Purpose                                |
|--------|------------------------------|----------------------------------------|
| POST   | `/api/auth/register`         | Register a new user                    |
| POST   | `/api/auth/login`            | Authenticate and receive JWT          |
| POST   | `/api/analysis/analyze`      | Upload resume + JD and trigger analysis |
| GET    | `/api/analysis/history`      | List user's analysis history          |
| GET    | `/api/analysis/:id`          | View full result of a single analysis |
| POST   | `/api/chat/analysis/:id`     | Ask AI questions about an analysis    |
| POST   | `/api/ats/check`             | Run public ATS compatibility check    |
| GET    | `/api/ats/tips`              | Retrieve universal ATS formatting tips |

---

## ⚙️ Setup Instructions

### 🔐 Prerequisites
- Node.js v18+
- MongoDB URI (Atlas or local)
- API keys for:
  - Gemini
  - OpenRouter
  - Mistral
  - Cohere

---

### 📦 Backend

```bash
cd backend
npm install
cp .env.example .env
````

**`.env`**

```env
PORT=12001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
JWT_LIFETIME=7d

# AI API Keys
GEMINI_API_KEY=...
OPEN_ROUTER_API_KEY=...
MISTRAL_API_KEY=...
COHERE_API_KEY=...
```

Start the server:

```bash
npm run dev
```

---

### 💻 Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

**`.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:12001
# Or production: https://yourprojectname.onrender.com
```

Start the app:

```bash
npm run dev
```

---


## 📈 AI Match & ATS Logic

### Match Score Calculation

* AI uses prompt-engineered scoring via LLMs
* Strict rules for:

  * Experience years
  * Education level
  * Role seniority

### ATS Simulation

* Checks:

  * Contact info visibility
  * Section headers (Experience, Education, Skills)
  * Parsing traps (tables, special formatting)
  * Keyword and verb coverage
* Outputs realistic score (20–90%) + issues + suggestions

---

## 👤 Author

**Dheemanth M**

📧 [dheemanthm.official@gmail.com](mailto:dheemanthm.official@gmail.com)
🔗 [github.com/dheemanthm2004](https://github.com/dheemanthm2004)


