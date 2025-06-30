# 🚀 ResuScanX Deployment Guide

Complete step-by-step guide to deploy ResuScanX in production.

## 🎯 Deployment Options

| Option | Cost | Difficulty | Best For |
|--------|------|------------|----------|
| **Vercel + Railway** | Free tier available | Easy | Beginners |
| **Docker + VPS** | $5-20/month | Medium | Developers |
| **AWS/GCP** | Pay-as-use | Hard | Enterprise |

---

## 🌟 Option 1: Vercel + Railway (Recommended)

### Step 1: Setup MongoDB Atlas (Free)

1. **Create Account**: https://cloud.mongodb.com
2. **Create Cluster**: 
   - Choose "Free Shared" (M0)
   - Select region closest to users
   - Cluster name: `resuscanx-cluster`
3. **Create Database User**:
   - Username: `resuscanx-user`
   - Password: Generate strong password
4. **Network Access**: Add `0.0.0.0/0` (allow all IPs)
5. **Get Connection String**: 
   ```
   mongodb+srv://resuscanx-user:PASSWORD@resuscanx-cluster.xxxxx.mongodb.net/resuscanx
   ```

### Step 2: Get API Keys (Free Tiers)

#### Google Gemini (Required)
1. Visit: https://makersuite.google.com/app/apikey
2. Create new API key
3. Copy: `AIzaSy...` format

#### OpenRouter (Optional Fallback)
1. Visit: https://openrouter.ai/keys
2. Sign up and create key
3. Copy: `sk-or-v1-...` format

### Step 3: Deploy Backend (Railway)

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Deploy Backend**:
   ```bash
   cd backend
   railway new
   # Choose "Empty Project"
   # Project name: resuscanx-backend
   
   railway deploy
   ```

4. **Add Environment Variables** in Railway Dashboard:
   ```
   PORT=12001
   NODE_ENV=production
   MONGO_URI=mongodb+srv://resuscanx-user:PASSWORD@cluster.mongodb.net/resuscanx
   JWT_SECRET=your-super-secure-32-character-secret-key
   JWT_LIFETIME=30d
   GEMINI_API_KEY=AIzaSy-your-gemini-key
   OPEN_ROUTER_API_KEY=sk-or-v1-your-openrouter-key
   MISTRAL_API_KEY=your-mistral-key
   COHERE_API_KEY=your-cohere-key
   ```

5. **Get Backend URL**: Copy from Railway dashboard (e.g., `https://resuscanx-backend-production.up.railway.app`)

### Step 4: Deploy Frontend (Vercel)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel
   # Follow prompts:
   # - Link to existing project? No
   # - Project name: resuscanx
   # - Directory: ./
   # - Override settings? No
   ```

3. **Add Environment Variable** in Vercel Dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url.up.railway.app
   ```

4. **Redeploy**:
   ```bash
   vercel --prod
   ```

### Step 5: Configure CORS

Update `backend/server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app'
  ],
  credentials: true
}));
```

Redeploy backend:
```bash
railway deploy
```

### ✅ Done! Your app is live at: `https://your-app.vercel.app`

---

## 🐳 Option 2: Docker + VPS

### Step 1: Prepare VPS

**Recommended Providers**:
- DigitalOcean ($5/month droplet)
- Linode ($5/month nanode)
- Vultr ($2.50/month instance)

**VPS Setup**:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
sudo apt install nginx -y
```

### Step 2: Create Docker Files

**Backend Dockerfile** (`backend/Dockerfile`):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 12001
CMD ["npm", "start"]
```

**Frontend Dockerfile** (`frontend/Dockerfile`):
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

**Docker Compose** (`docker-compose.yml`):
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "12001:12001"
    environment:
      - PORT=12001
      - NODE_ENV=production
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_LIFETIME=30d
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - OPEN_ROUTER_API_KEY=${OPEN_ROUTER_API_KEY}
      - MISTRAL_API_KEY=${MISTRAL_API_KEY}
      - COHERE_API_KEY=${COHERE_API_KEY}
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://your-domain.com:12001
    restart: unless-stopped
    depends_on:
      - backend
```

### Step 3: Environment Setup

Create `.env` file:
```bash
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/resuscanx
JWT_SECRET=your-super-secure-32-character-secret-key
GEMINI_API_KEY=AIzaSy-your-gemini-key
OPEN_ROUTER_API_KEY=sk-or-v1-your-openrouter-key
MISTRAL_API_KEY=your-mistral-key
COHERE_API_KEY=your-cohere-key
```

### Step 4: Deploy with Docker

```bash
# Clone repository
git clone https://github.com/dheemanthm2004/ResuScanX.git
cd ResuScanX

# Build and start
docker-compose up -d --build

# Check status
docker-compose ps
```

### Step 5: Configure Nginx

Create Nginx config (`/etc/nginx/sites-available/resuscanx`):
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:12001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/resuscanx /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: SSL Certificate (Optional)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🔧 Production Optimizations

### Backend Optimizations

**1. Add Rate Limiting**:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

**2. Add Compression**:
```javascript
const compression = require('compression');
app.use(compression());
```

**3. Add Security Headers**:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### Frontend Optimizations

**1. Enable Image Optimization** (`next.config.js`):
```javascript
module.exports = {
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
}
```

**2. Add Service Worker** for caching

### Database Optimizations

**1. Add Indexes**:
```javascript
// In MongoDB
db.analyses.createIndex({ "userId": 1, "createdAt": -1 })
db.users.createIndex({ "email": 1 }, { unique: true })
```

---

## 📊 Monitoring & Maintenance

### Health Checks

**Backend Health Endpoint** (`/api/health`):
```javascript
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

### Log Management

**PM2 Logs** (if using PM2):
```bash
pm2 logs resuscanx-backend
pm2 logs resuscanx-frontend
```

**Docker Logs**:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Backup Strategy

**MongoDB Backup**:
```bash
# Daily backup script
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/resuscanx" --out=/backups/$(date +%Y%m%d)
```

---

## 🚨 Troubleshooting

### Common Issues

**1. CORS Errors**
```javascript
// Fix: Update CORS configuration
app.use(cors({
  origin: ['https://your-frontend-domain.com'],
  credentials: true
}));
```

**2. API Key Issues**
```bash
# Check environment variables
echo $GEMINI_API_KEY
# Should not be empty
```

**3. Database Connection**
```bash
# Test MongoDB connection
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Error:', err));
"
```

**4. Memory Issues**
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 server.js
```

### Performance Issues

**1. Slow API Responses**
- Add Redis caching
- Optimize database queries
- Use CDN for static assets

**2. High Memory Usage**
- Monitor with `htop`
- Add swap space if needed
- Optimize Docker containers

---

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx/HAProxy)
- Deploy multiple backend instances
- Use Redis for session storage

### Database Scaling
- MongoDB Atlas auto-scaling
- Read replicas for heavy read workloads
- Sharding for large datasets

### CDN Integration
- Cloudflare for global distribution
- AWS CloudFront for static assets
- Image optimization services

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] All API keys obtained
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Domain name configured (if applicable)

### Post-Deployment
- [ ] Health checks passing
- [ ] SSL certificate installed
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Performance optimizations applied

### Testing
- [ ] User registration works
- [ ] Resume upload works
- [ ] AI analysis completes
- [ ] Chat functionality works
- [ ] Mobile responsiveness verified

---

**🎉 Congratulations! Your ResuScanX is now live and helping people get honest career feedback!**

For support, create an issue on GitHub or contact: dheemanthm.official@gmail.com