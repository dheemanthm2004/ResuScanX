const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const analysisRoutes = require('./routes/analysis');
const chatRoutes = require('./routes/chat');
const atsRoutes = require('./routes/ats');

const app = express();

// === CORS CONFIG ===
const allowedOrigins = [
  'http://localhost:3000',
  'https://resuscanx.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

// === MIDDLEWARE ===
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// === ROUTES ===
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ats', atsRoutes);

// === DATABASE CONNECTION ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// === START SERVER ===
const PORT = process.env.PORT || 12001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
