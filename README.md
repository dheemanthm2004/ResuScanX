# 🎯 ResuScanX - AI-Powered Resume Analysis Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![AI](https://img.shields.io/badge/AI-Multi--Provider-purple?style=flat-square)](https://github.com)

> **Professional AI-powered resume analysis platform that intelligently matches resumes with job descriptions using advanced NLP, machine learning algorithms, and multiple AI providers.**

## 🌟 Overview

ResuScanX is a comprehensive full-stack application that leverages cutting-edge AI/ML technologies to provide intelligent resume analysis. Built with modern web technologies and integrated with multiple AI providers, it offers both real-time AI analysis and robust algorithmic fallbacks.

### 🎥 Demo
- **Live Demo**: [ResuScanX Platform](https://)


## 🚀 Key Features

### 🤖 AI-Powered Analysis
- **Multi-AI Integration**: OpenRouter (Llama 3.2), Mistral AI, Cohere
- **Intelligent Fallback**: Custom NLP algorithms ensure 100% uptime
- **Real-time Processing**: Instant analysis with live AI responses
- **Dual Analysis**: Side-by-side AI vs Algorithm comparison

### 📊 Advanced Analytics
- **Smart Skill Extraction**: NLP-powered skill identification
- **Compatibility Scoring**: Weighted algorithms for accurate matching
- **Gap Analysis**: Identifies missing skills and improvement areas
- **Visual Reports**: Interactive pie charts and detailed breakdowns

### 💼 Professional Features
- **PDF Resume Upload**: Intelligent text extraction and parsing
- **Job Description Analysis**: Copy-paste JD processing
- **Historical Tracking**: Complete analysis history with timestamps
- **Secure Authentication**: JWT-based user management
- **Responsive Design**: Mobile-first, professional UI/UX

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom components
- **Charts**: Chart.js with React integration
- **State Management**: React Hooks and Context
- **HTTP Client**: Axios with interceptors

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT with bcrypt hashing
- **File Processing**: Multer + PDF-Parse for resume extraction
- **AI Integration**: Multiple provider APIs with fallback

### AI/ML Technologies
- **NLP Processing**: Natural.js for text analysis
- **AI Providers**: OpenRouter, Mistral, Cohere APIs
- **Machine Learning**: Custom similarity algorithms
- **Data Analytics**: Statistical analysis and scoring

## 📁 Project Structure

```
ResuScanX/
├── frontend/                 # Next.js React application
│   ├── app/                 # App router pages
│   ├── components/          # Reusable UI components
│   ├── lib/                # API clients and utilities
│   └── types/              # TypeScript definitions
├── backend/                 # Node.js Express server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic & AI integration
│   ├── middleware/         # Authentication & validation
│   └── uploads/            # File storage
└── docs/                   # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account
- AI API keys (OpenRouter, Mistral, Cohere)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ResuScanX.git
cd ResuScanX
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

4. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:12001

## ⚙️ Environment Configuration

### Backend (.env)
```env
PORT=12001
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ResuScanX
JWT_SECRET=your-super-secret-jwt-key
JWT_LIFETIME=30d

# AI API Keys
OPEN_ROUTER_API_KEY=sk-or-v1-your-key
MISTRAL_API_KEY=your-mistral-key
COHERE_API_KEY=your-cohere-key
GEMINI_API_KEY=your-gemini-key
```

## 🎯 Core Functionality

### Resume Analysis Pipeline
1. **PDF Upload & Parsing**: Extract text from resume PDFs
2. **Skill Extraction**: NLP-powered identification of technical skills
3. **Job Description Processing**: Parse and analyze job requirements
4. **AI Analysis**: Multi-provider AI generates professional insights
5. **Algorithmic Scoring**: Custom algorithms calculate match percentages
6. **Report Generation**: Comprehensive analysis with recommendations

### AI Integration Architecture
```javascript
// Multi-AI Provider System
const aiProviders = [
  { name: 'OpenRouter', model: 'llama-3.2-3b-instruct' },
  { name: 'Mistral', model: 'mistral-tiny' },
  { name: 'Cohere', model: 'command-light' }
];

// Intelligent Fallback System
const analysis = await Promise.allSettled(aiProviders.map(tryProvider));
const result = analysis.find(r => r.status === 'fulfilled')?.value || fallback();
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication

### Analysis Endpoints
- `POST /api/analysis/analyze` - Upload resume and analyze
- `GET /api/analysis/history` - Get user's analysis history
- `GET /api/analysis/:id` - Get specific analysis details

### Request/Response Examples

**Analyze Resume**
```javascript
// Request
POST /api/analysis/analyze
Content-Type: multipart/form-data

{
  resume: [PDF File],
  jobDescription: "Software Engineer role requiring React, Node.js..."
}

// Response
{
  "analysis": {
    "matchScore": 78,
    "skillsMatch": ["javascript", "react", "node"],
    "skillsGap": ["kubernetes", "docker"],
    "recommendations": [...]
  },
  "aiReport": "Professional AI analysis...",
  "fallbackReport": "Algorithmic analysis..."
}
```

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Interactive Charts**: Pie charts for visual skill analysis
- **Responsive Layout**: Mobile-first design approach
- **Real-time Feedback**: Loading states and progress indicators
- **Dual Analysis View**: Side-by-side AI and algorithmic reports

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Comprehensive request validation
- **File Upload Security**: PDF-only uploads with size limits
- **CORS Configuration**: Proper cross-origin resource sharing

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Railway/Render)
```bash
# Set environment variables
# Deploy using platform-specific commands
```

### Database (MongoDB Atlas)
- Cloud-hosted MongoDB with automatic scaling
- Secure connection strings and authentication

## 📈 Performance Optimizations

- **Async Processing**: Non-blocking AI API calls
- **Caching**: Intelligent caching of analysis results
- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js built-in image optimization
- **Database Indexing**: Optimized MongoDB queries

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Dheemanth M**
- GitHub: [@dheemanthm2004](https://github.com/dheemanthm2004)
- LinkedIn: [Dheemanth M](https://linkedin.com/in/yourprofile)
- Email: dheemanthm.official@gmail.com

## 🙏 Acknowledgments

- OpenRouter for free AI API access
- Mistral AI for advanced language models
- Cohere for NLP capabilities
- MongoDB Atlas for cloud database hosting
- Vercel for seamless frontend deployment

## 📊 Project Stats

- **Lines of Code**: 5,000+
- **Components**: 15+ React components
- **API Endpoints**: 8 RESTful endpoints
- **AI Providers**: 4 integrated providers
- **Database Collections**: 3 MongoDB collections

---

<div align="center">
  <strong>⭐ Star this repository if you found it helpful!</strong>
  <br>
  <em>Built with ❤️ for the developer community</em>
</div>