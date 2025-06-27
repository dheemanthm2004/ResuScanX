# ResuScanX 🚀

**Next-Gen AI Resume Analysis Platform**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-resuscanx.vercel.app-blue?style=for-the-badge&logo=vercel)](https://resuscanx.vercel.app)
[![GitHub](https://img.shields.io/badge/⭐_Star_on_GitHub-black?style=for-the-badge&logo=github)](https://github.com/dheemanthm2004/ResuScanX)

> **The future of career optimization is here.** ResuScanX leverages cutting-edge AI to transform how you analyze resume-job compatibility. Built for the modern job seeker who demands precision, speed, and intelligence.

## ✨ What Makes ResuScanX Special

🤖 **Multi-AI Powered** - OpenRouter, Mistral, Cohere & Gemini working in harmony  
📊 **Real-Time Analytics** - Instant compatibility scoring with visual insights  
💬 **AI Career Coach** - Interactive Gemini assistant for personalized guidance  
🎨 **Gen-Z Design** - Beautiful, modern interface that doesn't compromise on professionalism  
⚡ **Lightning Fast** - Optimized for speed without sacrificing accuracy  
🔒 **Privacy First** - Your data stays secure with enterprise-grade protection  

## 🎯 Core Features

### 🧠 Intelligent Analysis Engine
- **PDF Resume Parsing** - Advanced NLP extracts every detail
- **Multi-AI Processing** - 4 AI providers ensure comprehensive analysis
- **Smart Skill Matching** - Identifies exact skill overlaps and gaps
- **Compatibility Scoring** - Weighted algorithms for precise matching

### 📈 Visual Analytics Dashboard
- **Interactive Charts** - Beautiful pie charts and progress indicators
- **Real-Time Insights** - Live AI analysis with fallback systems
- **Historical Tracking** - Monitor your progress over time
- **Export Reports** - Download detailed analysis for offline use

### 💬 AI-Powered Career Coaching
- **Gemini Integration** - Google's latest AI for personalized advice
- **Context-Aware Chat** - Understands your specific analysis
- **Interview Prep** - Tailored tips based on your profile
- **Skill Development** - Actionable learning recommendations

## 🛠 Tech Stack

**Frontend Magic**  
Next.js  • TypeScript • Tailwind CSS • Chart.js • Framer Motion

**Backend Power**  
Node.js • Express • MongoDB Atlas • JWT Auth • Multer

**AI Arsenal**  
🤖 OpenRouter (Llama 3.2) • 🧠 Mistral AI • 💎 Cohere • ✨ Google Gemini

**Deployment**  
Vercel • Railway • MongoDB Atlas

## 🚀 Quick Start

```bash
# Clone the future
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

## ⚙️ Configuration

Create `.env` in backend folder:
```env
PORT=12001
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_super_secret_key

# AI API Keys (Free Tier Available)
OPEN_ROUTER_API_KEY=sk-or-v1-your-key
MISTRAL_API_KEY=your-mistral-key
COHERE_API_KEY=your-cohere-key
GEMINI_API_KEY=your-gemini-key
```

## 🎨 Design Philosophy

ResuScanX embraces **Gen-Z aesthetics** while maintaining **professional credibility**:

- **Glassmorphism** - Subtle transparency and blur effects
- **Gradient Magic** - Smooth color transitions throughout
- **Micro-interactions** - Delightful hover effects and animations
- **Modern Typography** - Inter font for perfect readability
- **Accessible Colors** - WCAG compliant color schemes

## 📊 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | Authentication |
| `POST` | `/api/analysis/analyze` | Resume analysis |
| `GET` | `/api/analysis/history` | Analysis history |
| `GET` | `/api/analysis/:id` | Specific analysis |
| `POST` | `/api/chat/analysis/:id` | AI chat |

## 🔥 Advanced Features

### Multi-AI Fallback System
```javascript
const aiProviders = [
  { name: 'OpenRouter', model: 'llama-3.2-3b' },
  { name: 'Mistral', model: 'mistral-tiny' },
  { name: 'Cohere', model: 'command-light' }
];

// Intelligent fallback ensures 100% uptime
const analysis = await Promise.allSettled(providers);
```

### Smart Skill Extraction
- **NLP Processing** - Natural language understanding
- **Semantic Analysis** - Context-aware skill identification
- **Industry Mapping** - Role-specific skill categorization
- **Trend Analysis** - Emerging skill detection

## 🎯 Use Cases

**For Job Seekers**
- Optimize resumes for specific roles
- Identify skill gaps before applying
- Get AI-powered interview preparation
- Track application success rates

**For Career Coaches**
- Provide data-driven guidance
- Benchmark client profiles
- Generate detailed reports
- Monitor progress over time

**For Recruiters**
- Quick candidate screening
- Skill gap analysis
- Interview question generation
- Talent pipeline optimization


---

## 📄 License

MIT License - Build amazing things with ResuScanX!

## 👨‍💻 Creator

**Dheemanth M**  
🎯 Full-Stack Developer & AI Enthusiast  
📧 [dheemanthm.official@gmail.com](mailto:dheemanthm.official@gmail.com)  
🔗 [GitHub](https://github.com/dheemanthm2004) • [LinkedIn](https://linkedin.com/in/yourprofile)

---

<div align="center">
  <strong>🌟 Star this repo if ResuScanX helped you!</strong>
  <br>
  <em>Built with 💜 for the next generation of job seekers</em>
  <br><br>
  <img src="https://img.shields.io/github/stars/dheemanthm2004/ResuScanX?style=social" alt="GitHub stars">
  <img src="https://img.shields.io/github/forks/dheemanthm2004/ResuScanX?style=social" alt="GitHub forks">
</div>