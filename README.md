# ResuScanX 🎯

**Brutally Honest AI Resume Analysis - No False Hope, Just Reality**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Deploy_Your_Own-blue?style=for-the-badge)](https://github.com/dheemanthm2004/ResuScanX)
[![GitHub Stars](https://img.shields.io/github/stars/dheemanthm2004/ResuScanX?style=for-the-badge&logo=github)](https://github.com/dheemanthm2004/ResuScanX)

> **Stop wasting time on jobs you're not qualified for.** ResuScanX gives brutally honest AI analysis of your resume vs any job description. Fresher applying for senior role? Get 20% score, not fake 80%. Reality-based career guidance that actually helps.

## 🎯 Why ResuScanX is Different

❌ **Other Tools**: Give 80% match to freshers for senior roles (misleading)  
✅ **ResuScanX**: Gives 20% match to freshers for senior roles (honest)

❌ **Other Tools**: Focus only on skill matching  
✅ **ResuScanX**: Checks experience, education, seniority FIRST - then skills

❌ **Other Tools**: Diplomatic feedback that doesn't help  
✅ **ResuScanX**: "You need 3+ years experience first" - actionable reality

## 🚀 Key Features

### 🎯 **Honest Analysis Engine**
- **Experience-First Logic** - Checks if you meet basic requirements before skills
- **Multi-Factor Scoring** - Experience (30%) + Skills (40%) + Education (15%) + Seniority (15%)
- **Reality-Based Verdicts** - QUALIFIED/UNDERQUALIFIED/COMPLETELY_UNQUALIFIED

### 🤖 **AI-Powered Intelligence**
- **Google Gemini Integration** - Advanced natural language processing
- **Comprehensive Analysis** - 1000+ word detailed reports
- **Smart Validation** - Overrides AI when it's being too lenient

### 📊 **Visual Insights**
- **Comprehensive Charts** - Eligibility vs Skills breakdown
- **Critical Issues Highlighting** - Shows blocking problems clearly
- **Progress Tracking** - History with enhanced analysis

### 💬 **Career Guidance**
- **Actionable Recommendations** - Specific next steps
- **Reality Checks** - "Don't apply" vs "Apply now" guidance
- **AI Career Coach** - Chat about your analysis results

## 🛠 Technology Stack

**Frontend**
- Next.js 14 with TypeScript
- Tailwind CSS for modern UI
- Chart.js for visual analytics
- React Hook Form for validation

**Backend**
- Node.js with Express
- MongoDB Atlas for data storage
- JWT authentication
- PDF processing with multer

**AI Integration**
- Google Gemini (Primary)
- OpenRouter (Fallback)
- Mistral AI (Fallback)
- Advanced prompt engineering

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free)
- Google Gemini API key (free tier available)
- Git for version control

## ⚡ Quick Setup

### 1. Clone Repository
```bash
git clone https://github.com/dheemanthm2004/ResuScanX.git
cd ResuScanX
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=12001
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/resuscanx
JWT_SECRET=your-super-secure-jwt-secret-key-min-32-chars
JWT_LIFETIME=30d
GEMINI_API_KEY=AIzaSy-your-gemini-api-key-here
OPEN_ROUTER_API_KEY=sk-or-v1-your-openrouter-key
MISTRAL_API_KEY=your-mistral-api-key
COHERE_API_KEY=your-cohere-api-key
EOF

# Start backend
npm run dev
```

### 3. Frontend Setup
```bash
# New terminal
cd frontend
npm install

# Create .env.local (optional)
echo "NEXT_PUBLIC_API_URL=http://localhost:12001" > .env.local

# Start frontend
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:12001

## 🔑 API Keys Setup

### Required (Free Tier Available)
1. **Google Gemini**: https://makersuite.google.com/app/apikey
2. **MongoDB Atlas**: https://cloud.mongodb.com (free 512MB)

### Optional (Fallback APIs)
3. **OpenRouter**: https://openrouter.ai/keys (free tier)
4. **Mistral AI**: https://console.mistral.ai (free tier)
5. **Cohere**: https://dashboard.cohere.ai (free tier)

## 🚀 Deployment Guide

### Option 1: Vercel + Railway (Recommended)

#### Backend (Railway)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway new
railway add --database mongodb
railway deploy

# Add environment variables in Railway dashboard
```

#### Frontend (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Add environment variables in Vercel dashboard
```

### Option 2: Docker Deployment

#### Backend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 12001
CMD ["npm", "start"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "12001:12001"
    environment:
      - MONGO_URI=${MONGO_URI}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:12001
```

### Option 3: VPS Deployment

#### Using PM2
```bash
# Install PM2
npm install -g pm2

# Backend
cd backend
pm2 start server.js --name "resuscanx-backend"

# Frontend
cd frontend
npm run build
pm2 start npm --name "resuscanx-frontend" -- start

# Setup Nginx reverse proxy
sudo nano /etc/nginx/sites-available/resuscanx
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:12001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📊 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | User registration | No |
| `POST` | `/api/auth/login` | User authentication | No |
| `POST` | `/api/analysis/analyze` | Resume analysis | Yes |
| `GET` | `/api/analysis/history` | Analysis history | Yes |
| `GET` | `/api/analysis/:id` | Specific analysis | Yes |
| `POST` | `/api/chat/analysis/:id` | AI career chat | Yes |

## 🎯 Real-World Examples

**Scenario 1: Fresher + Senior Developer (5+ years)**
```
Input: Fresh graduate resume + Senior Dev JD
Output: 
- Score: 18%
- Verdict: COMPLETELY_UNQUALIFIED
- Message: "Lacks required 5+ years experience"
- Advice: "Apply to junior developer roles first"
```

**Scenario 2: 2 Years Experience + Mid-Level Role**
```
Input: 2 years experience + 3+ years requirement
Output:
- Score: 65%
- Verdict: UNDERQUALIFIED
- Message: "Close but needs 1 more year experience"
- Advice: "Highlight projects and consider applying"
```

**Scenario 3: Perfect Match**
```
Input: 5 years experience + 3-5 years requirement
Output:
- Score: 87%
- Verdict: QUALIFIED
- Message: "Strong candidate for this role"
- Advice: "Prepare for interviews, highlight matching skills"
```

## 🔧 Troubleshooting

### Common Issues

**1. AI Analysis Fails**
```bash
# Check API keys in .env
echo $GEMINI_API_KEY

# Check backend logs
npm run dev
```

**2. Database Connection Issues**
```bash
# Test MongoDB connection
node -e "console.log(process.env.MONGO_URI)"
```

**3. CORS Issues**
```javascript
// backend/server.js - ensure CORS is configured
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : 'http://localhost:3000'
}));
```

## 📈 Performance Optimization

### Backend
- Use MongoDB indexes for faster queries
- Implement Redis caching for frequent requests
- Add rate limiting for API protection

### Frontend
- Enable Next.js image optimization
- Implement lazy loading for components
- Use React.memo for expensive components

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/honest-analysis`)
3. Commit changes (`git commit -m 'Add brutal honesty feature'`)
4. Push to branch (`git push origin feature/honest-analysis`)
5. Open Pull Request

## 📄 License

MIT License - Build amazing things with ResuScanX!

## 👨‍💻 Creator

**Dheemanth M**  
🎯 Full-Stack Developer & AI Enthusiast  
📧 [dheemanthm.official@gmail.com](mailto:dheemanthm.official@gmail.com)  
🔗 [GitHub](https://github.com/dheemanthm2004)

## 🙏 Acknowledgments

- **Google Gemini** - Advanced AI analysis
- **MongoDB Atlas** - Reliable cloud database
- **Vercel & Railway** - Seamless deployment platforms
- **Next.js & React** - Modern web development

---

<div align="center">
  <strong>🌟 Star this repo if ResuScanX gave you honest career feedback!</strong>
  <br>
  <em>Made with ❤️ and brutal honesty by Dheem</em>
  <br><br>
  
  **Ready to stop wasting time on wrong jobs?**  
  **[Deploy ResuScanX Now →](#-deployment-guide)**
</div>