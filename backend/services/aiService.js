const axios = require('axios');
const natural = require('natural');
const atsService = require('./atsService');

class AIService {
  // Extract skills using NLP
  extractSkills(text) {
    const skillKeywords = [
      // Programming Languages
      'javascript', 'python', 'java', 'typescript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
      // Frontend
      'react', 'angular', 'vue', 'html', 'css', 'sass', 'bootstrap', 'tailwind',
      // Backend
      'node', 'express', 'django', 'flask', 'spring', 'laravel', 'rails',
      // Databases
      'mongodb', 'mysql', 'postgresql', 'redis', 'elasticsearch', 'sql', 'nosql',
      // Cloud & DevOps
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible',
      // Tools & Others
      'git', 'linux', 'api', 'rest', 'graphql', 'microservices', 'agile', 'scrum',
      // AI/ML
      'machine learning', 'ai', 'data science', 'tensorflow', 'pytorch', 'pandas', 'numpy',
      // Mobile
      'react native', 'flutter', 'ios', 'android', 'swift', 'kotlin'
    ];
    
    const textLower = text.toLowerCase();
    const skills = skillKeywords.filter(skill => {
      // Check for exact matches and partial matches
      return textLower.includes(skill) || 
             textLower.split(/\W+/).some(token => 
               token === skill || 
               (skill.length > 3 && token.includes(skill)) ||
               (token.length > 3 && skill.includes(token))
             );
    });
    
    return [...new Set(skills)];
  }

  // Calculate similarity between resume and JD
  calculateSimilarity(resumeText, jobDescription) {
    const resumeTokens = resumeText.toLowerCase().split(/\W+/);
    const jdTokens = jobDescription.toLowerCase().split(/\W+/);
    
    const resumeSet = new Set(resumeTokens);
    const jdSet = new Set(jdTokens);
    
    const intersection = new Set([...resumeSet].filter(x => jdSet.has(x)));
    const union = new Set([...resumeSet, ...jdSet]);
    
    return (intersection.size / union.size) * 100;
  }

  // Generate dual AI reports
  async generateAIReport(resumeText, jobDescription, analysis) {
    const reports = await Promise.allSettled([
      this.tryOpenRouter(analysis),
      this.tryMistral(analysis),
      this.tryCohere(analysis)
    ]);

    const aiReport = reports.find(r => r.status === 'fulfilled')?.value;
    const fallbackReport = this.generateFallbackReport(analysis);

    return {
      aiReport: aiReport || '🤖 AI analysis temporarily unavailable',
      fallbackReport,
      aiProvider: aiReport ? 'Multi-AI Analysis' : 'Intelligent Fallback'
    };
  }

  async tryOpenRouter(analysis) {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [{
          role: 'user',
          content: `Resume Analysis:
Matched: ${analysis.skillsMatch.join(', ')}
Missing: ${analysis.skillsGap.join(', ')}
Score: ${analysis.matchScore}%

Provide brief professional assessment.`
        }],
        max_tokens: 300
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );
    return response.data.choices[0].message.content;
  }

  async tryMistral(analysis) {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-tiny',
        messages: [{
          role: 'user',
          content: `Analyze resume match: ${analysis.matchScore}% score. Matched skills: ${analysis.skillsMatch.slice(0,5).join(', ')}. Missing: ${analysis.skillsGap.slice(0,3).join(', ')}. Brief assessment?`
        }],
        max_tokens: 200
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );
    return response.data.choices[0].message.content;
  }

  async tryCohere(analysis) {
    const response = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: 'command-light',
        prompt: `Resume analysis: ${analysis.matchScore}% match. Skills: ${analysis.skillsMatch.slice(0,3).join(', ')}. Assessment:`,
        max_tokens: 150
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );
    return response.data.generations[0].text;
  }

  async chatWithAI(context) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{ text: context }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.log('Gemini chat error:', error.response?.data || error.message);
      return "I'm here to help with your resume analysis! The AI is currently busy, but I can still provide general career advice.";
    }
  }

  generateFallbackReport(analysis) {
    const verdict = analysis.matchScore >= 80 ? 'EXCELLENT MATCH' : 
                   analysis.matchScore >= 60 ? 'GOOD MATCH' : 
                   analysis.matchScore >= 40 ? 'MODERATE MATCH' : 'NEEDS IMPROVEMENT';
    
    const recommendation = analysis.matchScore >= 80 ? 
      'You are well-qualified for this role. Focus on highlighting your matching skills during interviews.' :
      analysis.matchScore >= 60 ?
      'You have a solid foundation. Consider strengthening the missing skills to become a stronger candidate.' :
      'Focus on developing the key missing skills through courses, projects, or certifications.';

    return `🎯 **PROFESSIONAL ANALYSIS REPORT**

📊 **VERDICT: ${verdict} (${analysis.matchScore}%)**

✅ **KEY STRENGTHS:**
${analysis.skillsMatch.slice(0, 6).map(skill => `• ${skill.toUpperCase()}`).join('\n')}

❌ **SKILLS TO DEVELOP:**
${analysis.skillsGap.slice(0, 6).map(skill => `• ${skill.toUpperCase()}`).join('\n')}

💡 **STRATEGIC RECOMMENDATIONS:**
${analysis.recommendations.map(rec => `• ${rec}`).join('\n')}

🎯 **NEXT STEPS:**
• ${recommendation}
• Update your resume to highlight matching skills
• Prepare examples demonstrating your relevant experience
• Consider building projects using the missing technologies

📈 **INTERVIEW PREPARATION:**
• Focus on your ${analysis.skillsMatch.slice(0, 3).join(', ')} experience
• Be ready to discuss how you can quickly learn ${analysis.skillsGap.slice(0, 2).join(' and ')}
• Highlight your adaptability and learning mindset`;
  }

  // Main analysis function
  async analyzeResume(resumeText, jobDescription) {
    const resumeSkills = this.extractSkills(resumeText);
    const jdSkills = this.extractSkills(jobDescription);
    
    const skillsMatch = resumeSkills.filter(skill => 
      jdSkills.some(jdSkill => jdSkill.includes(skill) || skill.includes(jdSkill))
    );
    
    const skillsGap = jdSkills.filter(skill => 
      !resumeSkills.some(resumeSkill => resumeSkill.includes(skill) || skill.includes(resumeSkill))
    );
    
    // Better match score calculation
    const baseScore = skillsMatch.length > 0 ? (skillsMatch.length / Math.max(jdSkills.length, 1)) * 100 : 0;
    const textSimilarity = this.calculateSimilarity(resumeText, jobDescription);
    const matchScore = Math.round((baseScore * 0.7) + (textSimilarity * 0.3));
    
    const analysis = {
      matchScore: Math.min(matchScore, 100),
      skillsMatch,
      skillsGap,
      recommendations: this.generateRecommendations(skillsGap, matchScore),
      summary: this.generateSummary(matchScore, skillsMatch.length, skillsGap.length),
      strengths: skillsMatch.slice(0, 5),
      improvements: skillsGap.slice(0, 5)
    };

    const reports = await this.generateAIReport(resumeText, jobDescription, analysis);
    const atsAnalysis = await atsService.checkATSCompatibility(resumeText, jobDescription);
    
    return { 
      analysis, 
      aiReport: reports.aiReport,
      fallbackReport: reports.fallbackReport,
      aiProvider: reports.aiProvider,
      atsAnalysis
    };
  }

  generateRecommendations(skillsGap, matchScore) {
    const recommendations = [];
    
    if (matchScore < 50) {
      recommendations.push('Consider gaining experience in the core technologies mentioned in the job description');
    }
    
    if (skillsGap.length > 5) {
      recommendations.push('Focus on learning the top 3-5 missing skills to improve your profile');
    }
    
    skillsGap.slice(0, 3).forEach(skill => {
      recommendations.push(`Learn ${skill} through online courses or practical projects`);
    });
    
    return recommendations;
  }

  generateSummary(matchScore, matchedSkills, gapSkills) {
    if (matchScore >= 80) {
      return `🎯 Excellent match! You have ${matchedSkills} relevant skills with ${gapSkills} areas for improvement.`;
    } else if (matchScore >= 60) {
      return `✅ Good match with ${matchedSkills} relevant skills. Focus on ${gapSkills} missing skills to strengthen your profile.`;
    } else if (matchScore >= 40) {
      return `⚠️ Moderate match. You have ${matchedSkills} relevant skills but need to develop ${gapSkills} additional skills.`;
    } else {
      return `❌ Low match. Consider gaining experience in ${gapSkills} key skills mentioned in the job description.`;
    }
  }
}

module.exports = new AIService();