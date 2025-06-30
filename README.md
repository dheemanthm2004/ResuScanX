
# ResuScanX

**AI-Powered Resume Analysis vs Job Description**

ResuScanX evaluates how well a candidate’s resume aligns with any job description using advanced NLP, AI reasoning, and ATS compliance checks. It’s designed to offer honest, structured feedback to help users target roles they are actually qualified for.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Click_Here-blue?style=for-the-badge)](https://resuscanx.vercel.app)

---

## 🔍 Features

- **Resume vs JD Matching** – Upload your resume and paste a job description to get a match score.
- **AI Scoring Engine** – Experience, skills, education, and seniority are evaluated before giving a verdict.
- **ATS Compatibility Checker** – Fast, login-free scan to check if resumes will pass common ATS filters.
- **Detailed AI Feedback** – 1000+ word report using Google Gemini and fallbacks (OpenRouter, Mistral).
- **AI Career Coach** – Ask questions based on your resume analysis and get job-specific answers.

---

## ⚙️ Tech Stack

### Frontend
- Next.js(TypeScript)
- Tailwind CSS
- Chart.js, React Hook Form

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- Multer (PDF upload), JWT Auth

### AI + NLP
- Google Gemini (primary)
- OpenRouter, Mistral AI (fallbacks)
- `natural`, `compromise` (NLP skills extraction)

---

## 🛠 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/dheemanthm2004/ResuScanX.git
cd ResuScanX
````

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env  # then edit it with your keys
npm run dev
```

**`.env` example:**

```
PORT=12001
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
JWT_LIFETIME=30d
GEMINI_API_KEY=your-google-gemini-key
OPEN_ROUTER_API_KEY=optional
MISTRAL_API_KEY=optional
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:12001" > .env.local
npm run dev
```

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:12001/api](http://localhost:12001/api)

---

## 🚀 Deployment

### Recommended:

* **Frontend**: Vercel
* **Backend**: Railway

Set API keys in both platforms' dashboards. You can also deploy via Docker or VPS (see `DEPLOYMENT.md`).

---

## 📡 Key API Endpoints

| Method | Endpoint                 | Auth | Purpose                      |
| ------ | ------------------------ | ---- | ---------------------------- |
| POST   | `/api/auth/register`     | ❌    | Register user                |
| POST   | `/api/auth/login`        | ❌    | Login                        |
| POST   | `/api/analysis/analyze`  | ✅    | Upload resume + JD           |
| GET    | `/api/analysis/history`  | ✅    | View past results            |
| GET    | `/api/analysis/:id`      | ✅    | Get a specific result        |
| POST   | `/api/chat/analysis/:id` | ✅    | Ask AI questions             |
| POST   | `/api/ats/check`         | ❌    | Free ATS compatibility check |
| GET    | `/api/ats/tips`          | ❌    | General ATS guidance         |

---

## 📈 Example Output

```json
{
  "matchScore": 67,
  "verdict": "UNDERQUALIFIED",
  "skillsMatch": ["JavaScript", "React"],
  "skillsGap": ["Node.js", "TypeScript"],
  "recommendations": [
    "Gain 1–2 years of experience",
    "Learn missing technologies"
  ]
}
```

---

## 👤 Author

**Dheemanth M**
Full-Stack Developer | AI Engineer
📧 [dheemanthm.official@gmail.com](mailto:dheemanthm.official@gmail.com)
🔗 [github.com/dheemanthm2004](https://github.com/dheemanthm2004)
