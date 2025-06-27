# ResuScanX 🎯

**AI-Powered Resume Analysis Platform**

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://resuscanx.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![AI](https://img.shields.io/badge/Multi--AI-purple?style=flat-square)](https://github.com)

A smart platform that analyzes your resume against job descriptions using multiple AI providers and advanced algorithms. Get instant feedback, skill gap analysis, and personalized recommendations.

## ✨ Features

- 📄 **PDF Resume Upload** - Smart text extraction and parsing
- 🤖 **Multi-AI Analysis** - OpenRouter, Mistral, Cohere integration
- 📊 **Visual Analytics** - Interactive charts and match scoring
- 💬 **AI Chat Assistant** - Ask questions about your analysis
- 📈 **Skill Gap Analysis** - Identify missing skills and get recommendations
- 📋 **Detailed Reports** - Comprehensive analysis with export options
- 🔐 **Secure & Private** - JWT authentication and secure file handling


## 🚀 How It Works

1. **Upload Resume** - Drop your PDF resume
2. **Paste Job Description** - Copy-paste the job requirements
3. **Get Analysis** - AI analyzes compatibility and generates insights
4. **Chat with AI** - Ask follow-up questions about your results
5. **Export Report** - Download detailed analysis for future reference

## 🛠 Tech Stack

**Frontend:** Next.js 14, TypeScript, Tailwind CSS, Chart.js  
**Backend:** Node.js, Express, MongoDB Atlas  
**AI/ML:** OpenRouter (Llama 3.2), Mistral AI, Cohere, Custom NLP  
**Auth:** JWT with bcrypt  
**Deployment:** Vercel (Frontend), Railway/Render (Backend)

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=ResuScanX+Dashboard)

### Analysis Results
![Analysis](https://via.placeholder.com/800x400/059669/FFFFFF?text=AI+Analysis+Results)

### AI Chat Assistant
![Chat](https://via.placeholder.com/800x400/7C3AED/FFFFFF?text=AI+Chat+Assistant)

## 🚀 Quick Start

```bash
# Clone the repository
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

**Live Demo:** [resuscanx.vercel.app](https://resuscanx.vercel.app)

## ⚙️ Environment Setup

Create `.env` in backend folder:
```env
PORT=12001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPEN_ROUTER_API_KEY=your_openrouter_key
MISTRAL_API_KEY=your_mistral_key
COHERE_API_KEY=your_cohere_key
```

## 🎯 Key Features Breakdown

### AI Analysis Engine
- **Multi-Provider Integration**: Uses OpenRouter, Mistral, and Cohere APIs
- **Intelligent Fallback**: Custom algorithms ensure 100% uptime
- **Real-time Processing**: Instant analysis with live AI responses

### Smart Analytics
- **Skill Extraction**: NLP-powered identification of technical skills
- **Match Scoring**: Weighted algorithms for accurate compatibility
- **Visual Reports**: Interactive pie charts and detailed breakdowns

### User Experience
- **Interactive Chat**: AI assistant for personalized career advice
- **Export Functionality**: Download reports for offline use
- **History Tracking**: View and revisit past analyses

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User authentication |
| POST | `/api/analysis/analyze` | Upload resume and analyze |
| GET | `/api/analysis/history` | Get analysis history |
| GET | `/api/analysis/:id` | Get specific analysis |
| POST | `/api/chat/analysis/:id` | Chat with AI about analysis |

## 🔒 Security & Performance

- **JWT Authentication** with secure password hashing
- **Input validation** and file upload restrictions
- **Async processing** for non-blocking AI calls
- **Responsive design** optimized for all devices
- **Error handling** with graceful fallbacks

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

**Dheemanth M**  
📧 dheemanthm.official@gmail.com  
🔗 [GitHub](https://github.com/dheemanthm2004) • [LinkedIn](https://linkedin.com/in/yourprofile)

## 📄 License

MIT License - feel free to use this project for learning and development.

---

<div align="center">
  <strong>⭐ Star this repo if it helped you!</strong>
  <br>
  <em>Built with ❤️ using modern AI/ML technologies</em>
</div>