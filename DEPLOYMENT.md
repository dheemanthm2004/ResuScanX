# 🚀 ResuScanX Deployment Guide

**Complete step-by-step guide to deploy ResuScanX for production use**

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Railway/Render account (free tier available)
- MongoDB Atlas account (free)
- AI API keys (all have free tiers)

---

## 🗄️ Step 1: Database Setup (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Account
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click **"Try Free"** and create account
3. Choose **"Shared"** (free tier)
4. Select **AWS** and closest region
5. Cluster name: `resuscanx-cluster`

### 1.2 Configure Database Access
1. **Database Access** → **Add New Database User**
   - Username: `resuscanx-user`
   - Password: Generate secure password
   - Role: `Atlas admin`

2. **Network Access** → **Add IP Address**
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Or add your specific IPs

### 1.3 Get Connection String
1. **Clusters** → **Connect** → **Connect your application**
2. Copy connection string:
   ```
   mongodb+srv://resuscanx-user:<password>@resuscanx-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. Replace `<password>` with your actual password

---

## 🔧 Step 2: Backend Deployment (Railway)

### 2.1 Prepare Backend for Deployment
1. **Update package.json** in backend folder:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'No build step required'"
  },
  "engines": {
    "node": "18.x"
  }
}
```

2. **Create railway.json** in backend folder:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2.2 Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Select your ResuScanX repository
5. Choose **backend** folder as root directory

### 2.3 Configure Environment Variables
In Railway dashboard → **Variables** tab:
```env
NODE_ENV=production
PORT=8080
MONGO_URI=mongodb+srv://resuscanx-user:yourpassword@resuscanx-cluster.xxxxx.mongodb.net/resuscanx?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_LIFETIME=30d
OPEN_ROUTER_API_KEY=sk-or-v1-your-openrouter-key
MISTRAL_API_KEY=your-mistral-api-key
COHERE_API_KEY=your-cohere-api-key
GEMINI_API_KEY=your-gemini-api-key
```

### 2.4 Get Backend URL
- After deployment, Railway provides a URL like: `https://resuscanx-backend-production.up.railway.app`
- Copy this URL for frontend configuration

---

## 🌐 Step 3: Frontend Deployment (Vercel)

### 3.1 Prepare Frontend for Deployment
1. **Update next.config.js**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://your-railway-backend-url.up.railway.app/api'
      : 'http://localhost:12001/api'
  },
  images: {
    domains: ['via.placeholder.com'],
  },
}

module.exports = nextConfig
```

2. **Update API configuration** in `frontend/lib/api.ts`:
```typescript
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-railway-backend-url.up.railway.app/api'
  : 'http://localhost:12001/api';
```

### 3.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. **New Project** → Import your ResuScanX repository
4. **Framework Preset**: Next.js
5. **Root Directory**: `frontend`
6. Click **Deploy**

### 3.3 Configure Custom Domain (Optional)
1. **Project Settings** → **Domains**
2. Add your custom domain: `resuscanx.yourdomain.com`
3. Configure DNS records as instructed

---

## 🔑 Step 4: API Keys Setup

### 4.1 OpenRouter API
1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up and get free credits
3. **API Keys** → Create new key
4. Copy: `sk-or-v1-xxxxxxxxxx`

### 4.2 Mistral AI
1. Go to [console.mistral.ai](https://console.mistral.ai)
2. Sign up for free tier
3. **API Keys** → Create new key
4. Copy the key

### 4.3 Cohere
1. Go to [dashboard.cohere.ai](https://dashboard.cohere.ai)
2. Sign up for free tier
3. **API Keys** → Create new key
4. Copy the key

### 4.4 Google Gemini
1. Go to [makersuite.google.com](https://makersuite.google.com)
2. **Get API Key** → Create new key
3. Copy: `AIzaSyxxxxxxxxxx`

---

## 🔧 Step 5: Production Configuration

### 5.1 Update CORS Settings
In `backend/server.js`:
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://resuscanx.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

### 5.2 Update Frontend API URLs
Replace all localhost URLs in frontend with your production backend URL.

### 5.3 Environment Variables Check
Ensure all environment variables are set in both Railway and Vercel:

**Railway (Backend):**
- All API keys
- MongoDB URI
- JWT secrets

**Vercel (Frontend):**
- API_URL pointing to Railway backend

---

## 🧪 Step 6: Testing Deployment

### 6.1 Test Backend
```bash
curl https://your-railway-backend-url.up.railway.app/api/auth/login
```

### 6.2 Test Frontend
1. Visit your Vercel URL
2. Register new account
3. Upload resume and test analysis
4. Check AI chat functionality

### 6.3 Monitor Logs
- **Railway**: Check deployment logs for errors
- **Vercel**: Check function logs for frontend issues
- **MongoDB**: Monitor database connections

---

## 🚀 Step 7: Custom Domain & SSL

### 7.1 Frontend Domain (Vercel)
1. **Project Settings** → **Domains**
2. Add: `resuscanx.yourdomain.com`
3. Configure DNS:
   ```
   Type: CNAME
   Name: resuscanx
   Value: cname.vercel-dns.com
   ```

### 7.2 Backend Domain (Railway)
1. **Settings** → **Domains**
2. Add custom domain: `api.resuscanx.yourdomain.com`
3. Configure DNS as instructed

---

## 📊 Step 8: Monitoring & Analytics

### 8.1 Set Up Monitoring
1. **Railway**: Built-in metrics dashboard
2. **Vercel**: Analytics and performance monitoring
3. **MongoDB**: Atlas monitoring for database performance

### 8.2 Error Tracking
Add error tracking service like Sentry:
```bash
npm install @sentry/node @sentry/nextjs
```

---

## 🔒 Step 9: Security Checklist

- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] JWT secrets are strong
- [ ] Database access restricted
- [ ] API rate limiting enabled
- [ ] HTTPS enforced
- [ ] File upload limits set

---

## 🎯 Step 10: Performance Optimization

### 10.1 Backend Optimization
```javascript
// Add compression
const compression = require('compression');
app.use(compression());

// Add rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
```

### 10.2 Frontend Optimization
- Enable Vercel Analytics
- Optimize images and fonts
- Enable caching headers

---

## 🚨 Troubleshooting

### Common Issues:

**1. CORS Errors**
- Check origin URLs in backend CORS config
- Ensure frontend API_URL is correct

**2. Database Connection Failed**
- Verify MongoDB connection string
- Check IP whitelist in Atlas

**3. API Keys Not Working**
- Verify all keys are correctly set
- Check API quotas and limits

**4. File Upload Issues**
- Check file size limits
- Verify multer configuration

**5. Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are installed

---

## 📞 Support

If you encounter issues:
1. Check deployment logs first
2. Verify all environment variables
3. Test API endpoints individually
4. Check database connections

---

## 🎉 Congratulations!

Your ResuScanX is now live and ready for production use! 

**Frontend**: `https://resuscanx.vercel.app`  
**Backend**: `https://your-backend.up.railway.app`  
**Database**: MongoDB Atlas  

Share your live URL and start helping people optimize their resumes! 🚀