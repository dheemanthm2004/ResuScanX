const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const atsService = require('../services/atsService');

const router = express.Router();

// Multer for file upload (no auth required for free ATS check)
const upload = multer({
  dest: 'uploads/temp/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Free ATS compatibility check (no login required)
router.post('/check', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume PDF required' });
    }

    // Extract text from PDF
    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // Run technical ATS compatibility analysis
    const atsAnalysis = await atsService.checkATSCompatibility(resumeText);
    const atsTips = atsService.getATSTips();

    res.json({
      atsAnalysis,
      atsTips,
      message: 'ATS compatibility check completed'
    });

  } catch (error) {
    // Clean up file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error('ATS check error:', error);
    res.status(500).json({ 
      message: 'ATS analysis failed', 
      error: error.message 
    });
  }
});

// Get ATS tips (no auth required)
router.get('/tips', (req, res) => {
  try {
    const tips = atsService.getATSTips();
    res.json({ tips });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get ATS tips' });
  }
});

module.exports = router;