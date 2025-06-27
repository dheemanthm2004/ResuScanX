const axios = require('axios');

class ATSService {
  // Real AI-powered ATS analysis
  async checkATSCompatibility(resumeText, jobDescription = '') {
    try {
      // Use AI to analyze ATS compatibility
      const aiAnalysis = await this.getAIATSAnalysis(resumeText, jobDescription);
      
      // Combine AI analysis with basic technical checks
      const technicalChecks = this.performTechnicalChecks(resumeText);
      
      return {
        atsScore: aiAnalysis.score || technicalChecks.score,
        issues: [...(aiAnalysis.issues || []), ...technicalChecks.issues],
        recommendations: [...(aiAnalysis.recommendations || []), ...technicalChecks.recommendations],
        summary: aiAnalysis.summary || this.generateATSSummary(technicalChecks.score, technicalChecks.issues.length),
        aiPowered: !!aiAnalysis.score
      };
    } catch (error) {
      console.log('AI ATS analysis failed, using technical checks:', error.message);
      // Fallback to technical checks if AI fails
      const technicalChecks = this.performTechnicalChecks(resumeText);
      return {
        ...technicalChecks,
        aiPowered: false
      };
    }
  }

  async getAIATSAnalysis(resumeText, jobDescription) {
    const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility:

RESUME TEXT:
${resumeText.substring(0, 2000)}

${jobDescription ? `JOB DESCRIPTION:
${jobDescription.substring(0, 500)}

` : ''}Please provide:
1. ATS compatibility score (0-100)
2. Specific formatting/parsing issues
3. Missing keywords or sections
4. Actionable recommendations

Format as JSON: {"score": number, "issues": ["issue1", "issue2"], "recommendations": ["rec1", "rec2"], "summary": "brief summary"}`;

    try {
      // Try Gemini first (most reliable for structured output)
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }]
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      
      // Try to parse JSON response
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        // If JSON parsing fails, extract info manually
        return this.parseAIResponse(aiResponse);
      }
    } catch (error) {
      throw new Error('AI analysis failed');
    }
  }

  parseAIResponse(response) {
    // Extract score
    const scoreMatch = response.match(/score["\s]*:?["\s]*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

    // Extract issues
    const issuesMatch = response.match(/issues?["\s]*:?[\s]*\[([^\]]+)\]/i);
    const issues = issuesMatch ? 
      issuesMatch[1].split(',').map(i => i.replace(/["\']/g, '').trim()).filter(i => i) : [];

    // Extract recommendations  
    const recsMatch = response.match(/recommendations?["\s]*:?[\s]*\[([^\]]+)\]/i);
    const recommendations = recsMatch ?
      recsMatch[1].split(',').map(r => r.replace(/["\']/g, '').trim()).filter(r => r) : [];

    // Extract summary
    const summaryMatch = response.match(/summary["\s]*:?["\s]*([^"\n]+)/i);
    const summary = summaryMatch ? summaryMatch[1].trim() : null;

    return { score, issues, recommendations, summary };
  }

  // Basic technical checks as fallback
  performTechnicalChecks(resumeText) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Critical technical checks only
    if (!/@/.test(resumeText)) {
      issues.push('No email address detected');
      recommendations.push('Include a professional email address');
      score -= 20;
    }

    if (resumeText.length < 300) {
      issues.push('Resume content appears too brief');
      recommendations.push('Expand resume content for better ATS parsing');
      score -= 25;
    }

    if (!/\b(experience|education|skills)\b/i.test(resumeText)) {
      issues.push('Missing standard resume sections');
      recommendations.push('Include standard sections: Experience, Education, Skills');
      score -= 30;
    }

    return {
      atsScore: Math.max(score, 0),
      issues,
      recommendations,
      summary: this.generateATSSummary(Math.max(score, 0), issues.length)
    };
  }



  generateATSSummary(score, issueCount) {
    if (score >= 90) {
      return `🟢 Excellent ATS compatibility! Your resume should parse well through most ATS systems.`;
    } else if (score >= 75) {
      return `🟡 Good ATS compatibility with ${issueCount} minor issues to address.`;
    } else if (score >= 60) {
      return `🟠 Moderate ATS compatibility. ${issueCount} issues may affect parsing.`;
    } else {
      return `🔴 Poor ATS compatibility. ${issueCount} critical issues need immediate attention.`;
    }
  }

  // Quick ATS tips for any user
  getATSTips() {
    return [
      '📄 Use standard fonts like Arial, Calibri, or Times New Roman',
      '📝 Include standard section headers (Experience, Education, Skills)',
      '🎯 Use keywords from the job description naturally',
      '📧 Place contact info at the top in plain text',
      '🚫 Avoid tables, text boxes, and graphics',
      '💼 Use bullet points instead of paragraphs',
      '📱 Save as both PDF and Word formats',
      '🔍 Use standard job titles and company names'
    ];
  }
}

module.exports = new ATSService();