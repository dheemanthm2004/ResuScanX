const express = require('express');
const auth = require('../middleware/auth');
const Analysis = require('../models/Analysis');
const aiService = require('../services/aiService');

const router = express.Router();

// Chat with AI about specific analysis
router.post('/analysis/:id', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const analysisId = req.params.id;
    
    if (!analysisId || analysisId === 'undefined') {
      return res.status(400).json({ message: 'Invalid analysis ID' });
    }
    
    const analysis = await Analysis.findOne({
      _id: analysisId,
      userId: req.userId
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    const context = `Resume Analysis Context:
- Match Score: ${analysis.analysis.matchScore}%
- Matched Skills: ${analysis.analysis.skillsMatch.join(', ')}
- Missing Skills: ${analysis.analysis.skillsGap.join(', ')}
- Job Description: ${analysis.jobDescription.substring(0, 500)}...

User Question: ${message}

Provide a helpful response based on this resume analysis.`;

    const response = await aiService.chatWithAI(context);
    
    res.json({ 
      response,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Chat failed', error: error.message });
  }
});

module.exports = router;