const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const Analysis = require('../models/Analysis');
const aiService = require('../services/aiService');

const router = express.Router();

// Multer configuration for PDF upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Analyze resume
router.post('/analyze', auth, upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription } = req.body;
    
    if (!req.file || !jobDescription) {
      return res.status(400).json({ message: 'Resume PDF and job description required' });
    }

    // Extract text from PDF
    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    // AI Analysis
    const { analysis, aiReport, fallbackReport, aiProvider } = await aiService.analyzeResume(resumeText, jobDescription);

    // Save analysis to database
    const analysisDoc = new Analysis({
      userId: req.userId,
      resumeFile: req.file.filename,
      jobDescription,
      resumeText,
      analysis,
      aiReport: typeof aiReport === 'string' ? aiReport : fallbackReport
    });

    await analysisDoc.save();

    res.json({
      id: analysisDoc._id,
      analysis,
      aiReport: typeof aiReport === 'string' ? aiReport : '🤖 AI analysis temporarily unavailable',
      fallbackReport,
      aiProvider,
      createdAt: analysisDoc.createdAt
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ message: 'Analysis failed', error: error.message });
  }
});

// Get analysis history
router.get('/history', auth, async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.userId })
      .select('-resumeText -aiReport')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch history', error: error.message });
  }
});

// Get specific analysis
router.get('/:id', auth, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analysis', error: error.message });
  }
});

module.exports = router;