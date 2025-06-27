const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeFile: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  resumeText: {
    type: String,
    required: true
  },
  analysis: {
    matchScore: Number,
    skillsMatch: [String],
    skillsGap: [String],
    recommendations: [String],
    summary: String,
    strengths: [String],
    improvements: [String]
  },
  aiReport: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);