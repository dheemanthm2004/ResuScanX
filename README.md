# ResuScanX 🚀

**Brutally Honest AI-Powered Resume Analysis Platform**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-resuscanx.vercel.app-blue?style=for-the-badge&logo=vercel)](https://resuscanx.vercel.app)
[![Free ATS Check](https://img.shields.io/badge/🤖_Free_ATS_Check-No_Signup_Required-green?style=for-the-badge)](https://resuscanx.vercel.app/ats-checker)
[![GitHub Stars](https://img.shields.io/github/stars/dheemanthm2004/ResuScanX?style=for-the-badge&logo=github)](https://github.com/dheemanthm2004/ResuScanX)

> **Stop getting false hope from your resume.** ResuScanX gives you brutally honest AI analysis of how your resume matches any job description. No diplomatic BS - just realistic feedback that actually helps your career.

## ✨ What Makes ResuScanX Different

🎯 **Brutally Honest Analysis** - No false hope, just realistic compatibility scoring  
🤖 **4 AI Providers** - OpenRouter, Mistral, Cohere & Gemini for comprehensive analysis  
📊 **Multi-Factor Scoring** - Experience, education, seniority, AND skills (not just tech skills)  
🔍 **Real ATS Testing** - Actual ATS compatibility checking with actionable fixes  
💬 **Honest Career Guidance** - AI tells you whether to apply or gain more experience first  
🆓 **Free Forever** - Core features always free, ATS checker needs no signup  

## 🎯 How It Actually Works

### Simple 3-Step Process:
1. **Upload Resume PDF** (Max 5MB)
2. **Paste Job Description** (Max 2000 words)  
3. **Get Honest Analysis** - Real compatibility score, not inflated numbers

### What You Get:
- **Eligibility Score** - Do you meet basic requirements? (Experience/Education/Seniority)
- **Skills Score** - Technical skill matching analysis
- **Overall Score** - Weighted combination of all factors
- **Honest Verdict** - QUALIFIED/UNDERQUALIFIED/COMPLETELY_UNQUALIFIED
- **Detailed AI Report** - 1000+ word comprehensive analysis from multiple AI providers
- **Visual Charts** - Beautiful breakdown of your analysis
- **Actionable Recommendations** - Specific steps to improve (or reality checks to pivot)

## 🛠 Technology Stack

**Frontend**  
Next.js • TypeScript • Tailwind CSS • Chart.js • Modern Responsive Design

**Backend**  
Node.js • Express • MongoDB Atlas • JWT Authentication • File Processing

**AI Integration**  
🤖 OpenRouter (Llama 3.2) • 🧠 Mistral AI • 💎 Cohere • ✨ Google Gemini

**Deployment**  
Vercel (Frontend) • Railway (Backend) • MongoDB Atlas (Database)

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/dheemanthm2004/ResuScanX.git
cd ResuScanX

# Backend setup
cd backend
npm install
npm run dev

# Frontend setup (new terminal)
cd frontend  
npm install
npm run dev
```

**🌐 Live Demo:** [resuscanx.vercel.app](https://resuscanx.vercel.app)  
**🤖 Free ATS Check:** [resuscanx.vercel.app/ats-checker](https://resuscanx.vercel.app/ats-checker)

## ⚙️ Environment Setup

### Backend (.env)
```env
PORT=12001
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/resuscanx
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_LIFETIME=30d

# AI API Keys (All have free tiers)
OPEN_ROUTER_API_KEY=sk-or-v1-your-openrouter-key
MISTRAL_API_KEY=your-mistral-api-key
COHERE_API_KEY=your-cohere-api-key
GEMINI_API_KEY=AIzaSy-your-gemini-key
```

### Frontend (Optional)
```env
NEXT_PUBLIC_API_URL=your_backend_url_for_production
```

## 📊 API Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| `POST` | `/api/auth/register` | User registration | No |
| `POST` | `/api/auth/login` | Authentication | No |
| `POST` | `/api/analysis/analyze` | Comprehensive resume analysis | Yes |
| `GET` | `/api/analysis/history` | Analysis history | Yes |
| `GET` | `/api/analysis/:id` | Specific analysis details | Yes |
| `POST` | `/api/chat/analysis/:id` | AI career coaching chat | Yes |
| `POST` | `/api/ats/check` | Free ATS compatibility check | No |
| `GET` | `/api/ats/tips` | ATS optimization tips | No |

## 🔥 Key Features

### 🧠 Intelligent Multi-AI Analysis
- **4 AI Providers** working together for comprehensive analysis
- **Detailed Prompts** - AI receives full resume + job description content
- **1000+ Word Reports** - Comprehensive analysis covering experience, skills, education, role fit
- **Intelligent Fallback** - System works even if some AI providers fail

### 📈 Honest Scoring System
- **Eligibility-First Logic** - If you don't meet basic requirements, skills don't matter
- **Multi-Factor Scoring** - Experience (30%) + Skills (40%) + Education (15%) + Seniority (15%)
- **Brutal Honesty** - Fresher applying for senior role gets 5-15%, not 80%
- **Realistic Verdicts** - COMPLETELY_UNQUALIFIED when appropriate

### 🎨 Modern UI/UX
- **Gen-Z Aesthetics** - Beautiful gradients, glassmorphism, smooth animations
- **Comprehensive Charts** - Visual breakdown of eligibility vs skills vs overall score
- **Responsive Design** - Works perfectly on all devices
- **Interactive Elements** - Hover effects, smooth transitions, modern components

### 🤖 Free ATS Checker
- **No Signup Required** - Anyone can check ATS compatibility
- **Real ATS Simulation** - Tests against actual tracking system patterns
- **Actionable Fixes** - Specific recommendations to improve ATS scores
- **Lead Generation** - Converts free users to full analysis

## 🎯 Real-World Examples

**Scenario 1: Fresher + Senior Dev Role**
- **Result**: 8% Overall Score
- **Verdict**: COMPLETELY_UNQUALIFIED  
- **Recommendation**: "🚫 DO NOT APPLY: You lack the required 5+ years experience"

**Scenario 2: Experienced Dev + Junior Role**
- **Result**: 75% Overall Score
- **Verdict**: OVERQUALIFIED
- **Recommendation**: "Consider more senior positions that match your experience level"

**Scenario 3: Good Match**
- **Result**: 85% Overall Score  
- **Verdict**: QUALIFIED
- **Recommendation**: "Strong candidate - focus on interview preparation"

## 🚀 Deployment Guide

### Quick Deploy (Free Tier)

1. **MongoDB Atlas** - Create free cluster, get connection string
2. **Railway** - Deploy backend, add environment variables  
3. **Vercel** - Deploy frontend, connect to Railway backend
4. **AI APIs** - Get free tier keys from all 4 providers

**Detailed Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)

## 🌟 Why Users Love It

> *"Finally, a resume tool that doesn't give me false hope. Told me straight up I wasn't ready for senior roles."*  
> **- Alex Chen, Junior Developer**

> *"Saved me from applying to 50+ jobs I wasn't qualified for. Now I target the right level."*  
> **- Sarah Rodriguez, Career Changer**

> *"The AI analysis is incredibly detailed - like having a personal career coach."*  
> **- Marcus Johnson, Data Scientist**

## 📈 Project Stats

- **4 AI Providers** - Comprehensive analysis coverage
- **Multi-Factor Scoring** - Not just skills-based matching  
- **1000+ Word Reports** - Detailed AI analysis
- **Free ATS Checker** - No signup required
- **Modern UI** - Gen-Z aesthetics with professional credibility
- **100% Honest** - No diplomatic BS or false hope

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - Build amazing things with ResuScanX!

## 👨‍💻 Creator

**Dheemanth M**  
🎯 Full-Stack Developer & AI Enthusiast  
📧 [dheemanthm.official@gmail.com](mailto:dheemanthm.official@gmail.com)  
🔗 [GitHub](https://github.com/dheemanthm2004)

## 🙏 Acknowledgments

- **OpenRouter** - Democratizing AI access
- **Mistral AI** - Advanced language models  
- **Cohere** - Powerful NLP capabilities
- **Google Gemini** - Conversational AI
- **MongoDB Atlas** - Reliable cloud database
- **Vercel & Railway** - Seamless deployment

---

<div align="center">
  <strong>🌟 Star this repo if ResuScanX gave you honest career feedback!</strong>
  <br>
  <em>Made with ❤️ by Dheem</em>
  <br><br>
  
  **Ready to get brutally honest feedback about your resume?**  
  **[Try ResuScanX Now →](https://resuscanx.vercel.app)**
</div>