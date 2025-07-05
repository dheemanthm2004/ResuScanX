
# 🧠 ResuScanX

**AI-Powered Resume vs Job Description Analyzer + ATS Compatibility Checker**

[![Live Demo](https://img.shields.io/badge/Live_App-Vercel-000?style=for-the-badge&logo=vercel)](https://resuscanx.vercel.app)
[![API](https://img.shields.io/badge/API-Render-0A66C2?style=for-the-badge&logo=render)](https://resuscanx.onrender.com)

---

## 📌 Overview

**ResuScanX** is a production-ready web application that empowers job seekers by comparing their resume to job descriptions using **4 AI providers** with intelligent failover, realistic recruiter-style scoring, and comprehensive ATS simulation. Built for real-world hiring scenarios.

---

## ✨ Core Features

### 🤖 Multi-AI Analysis Engine
- **4 AI Providers**: Gemini → Mistral → Cohere → OpenRouter
- **Intelligent Failover**: Automatic provider rotation for 99.9% uptime
- **Realistic Scoring**: 20-95% range matching real recruiter expectations
- **Role-Level Detection**: Entry/Junior/Mid/Senior with appropriate criteria

### 📊 Professional Assessment
- **Experience Gap Analysis**: Years of experience vs role requirements
- **Skill Categorization**: Must-have vs Preferred vs Nice-to-have
- **Red Flag Detection**: Automatic identification of major mismatches
- **Hiring Recommendations**: Clear HIRE/REJECT/MAYBE decisions

### ✅ Production ATS Simulation
- **Real ATS Behavior**: Simulates actual parsing failures (75% fail rate)
- **Keyword Optimization**: Industry-standard terminology matching
- **Format Compatibility**: Identifies parsing-breaking elements
- **Actionable Fixes**: Specific recommendations for ATS success

### 💬 AI Career Assistant
- **Context-Aware Chat**: Discusses your specific analysis results
- **Multi-Provider Support**: Uses all 4 AI providers for reliability
- **Interview Preparation**: Tailored advice based on your match score

### 📈 User Dashboard
- **Analysis History**: Track all your resume evaluations
- **Detailed Reports**: Export comprehensive hiring manager assessments
- **JWT Authentication**: Secure session management

---

## 🛠 Tech Stack

| Layer     | Technologies                             |
|-----------|------------------------------------------|
| Frontend  | Next.js 14, TypeScript, Tailwind CSS    |
| Backend   | Node.js, Express.js, MongoDB, JWT       |
| AI/ML     | Gemini (2), Mistral, Cohere, OpenRouter |
| Charts    | Chart.js, react-chartjs-2               |
| Parsing   | pdf-parse, multer                        |
| Hosting   | Vercel (frontend), Render (backend)      |

---

## 🏗 Project Structure

```
resuscan_a/
├── backend/
│   ├── routes/       → API endpoints (auth, analysis, chat, ats)
│   ├── models/       → MongoDB schemas (User, Analysis)
│   ├── services/     → AI & ATS processing logic
│   ├── middleware/   → JWT authentication
│   └── uploads/      → Temporary PDF storage
│
├── frontend/
│   ├── app/          → Next.js 14 App Router pages
│   ├── components/   → Reusable UI components
│   ├── lib/          → API client configuration
│   └── types/        → TypeScript definitions
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- AI API keys (Gemini, Mistral, Cohere, OpenRouter)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your API keys in .env
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🎯 AI Analysis Features

### Realistic Recruiter Logic
- **Experience Penalties**: Harsh but realistic gaps (3+ years = major penalty)
- **Critical Skills**: Missing must-haves severely impact scores
- **Project Complexity**: Advanced projects get score bonuses
- **Red Flag Caps**: Automatic score limits for major issues

### Multi-Provider Reliability
- **Primary**: Gemini (2 API keys for load distribution)
- **Fallbacks**: Mistral → Cohere → OpenRouter
- **Timeout Handling**: 18-20 second timeouts with graceful failover
- **Error Recovery**: Intelligent retry logic across providers

### Production-Ready ATS
- **Real Failure Rates**: Matches actual ATS parsing statistics
- **Format Detection**: Identifies tables, graphics, complex formatting
- **Keyword Analysis**: Industry-standard terminology matching
- **Scoring Range**: 25-85% (realistic for most resumes)

---

## 📊 API Endpoints

| Method | Endpoint                 | Description                    |
|--------|--------------------------|--------------------------------|
| POST   | `/api/auth/register`     | User registration              |
| POST   | `/api/auth/login`        | User authentication            |
| POST   | `/api/analysis/analyze`  | Resume analysis with AI        |
| GET    | `/api/analysis/history`  | User's analysis history        |
| GET    | `/api/analysis/:id`      | Specific analysis details      |
| POST   | `/api/chat/analysis/:id` | AI chat about analysis        |
| POST   | `/api/ats/check`         | ATS compatibility check        |
| GET    | `/api/ats/tips`          | ATS optimization tips          |

---

## 🔧 Environment Configuration

### Backend (.env)
```env
# Server
PORT=12001
NODE_ENV=production

# AI Providers (Priority Order)
GEMINI_API_KEY=your_primary_gemini_key
GEMINI_API_KEY_new=your_secondary_gemini_key
MISTRAL_API_KEY=your_mistral_key
COHERE_API_KEY=your_cohere_key
OPEN_ROUTER_API_KEY=your_openrouter_key

# Database & Auth
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_minimum_32_chars
JWT_LIFETIME=30d
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:12001
# Production: https://your-api-domain.com
```

---

## 🎨 Key Differentiators

- **Production-Ready**: Built for real interviews and hiring scenarios
- **Multi-AI Reliability**: 5 providers ensure 99.9% uptime
- **Realistic Scoring**: Matches actual recruiter evaluation criteria
- **ATS Accuracy**: Simulates real parsing failures and success rates
- **Interview-Ready**: Comprehensive reports suitable for hiring managers

---

## 👤 Author

[**Dheemanth M**](https://dheemanthmadaiah.vercel.app)

📧 [dheemanthm.official@gmail.com](mailto:dheemanthm.official@gmail.com)  
🔗 [GitHub](https://github.com/dheemanthm2004)  
💼 [LinkedIn](https://linkedin.com/in/dheemanth-m)


