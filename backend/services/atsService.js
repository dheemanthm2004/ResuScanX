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
    const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume for ATS compatibility:

RESUME TEXT:
${resumeText.substring(0, 2500)}

${jobDescription ? `JOB DESCRIPTION:
${jobDescription.substring(0, 800)}

` : ''}ANALYSIS REQUIREMENTS:
1. ATS compatibility score (0-100) - be realistic
2. Specific formatting/parsing issues that ATS systems struggle with
3. Missing keywords or standard sections
4. Actionable recommendations for improvement

COMMON ATS ISSUES TO CHECK:
- Non-standard fonts or formatting
- Missing contact information
- Lack of standard section headers
- Complex layouts, tables, graphics
- Missing relevant keywords
- Poor file format compatibility
- Inconsistent date formats

Respond in JSON format:
{
  "score": number (0-100),
  "issues": ["specific issue 1", "specific issue 2"],
  "recommendations": ["actionable rec 1", "actionable rec 2"],
  "summary": "brief honest summary of ATS compatibility"
}`;

    // Try multiple AI providers for better accuracy
    const providers = [
      () => this.tryGeminiATS(prompt),
      () => this.tryOpenRouterATS(prompt),
      () => this.tryMistralATS(prompt)
    ];

    for (const provider of providers) {
      try {
        const result = await provider();
        if (result && result.score !== undefined) {
          return result;
        }
      } catch (error) {
        console.log('ATS AI provider failed:', error.message);
        continue;
      }
    }
    
    throw new Error('All AI providers failed');
  }

  async tryGeminiATS(prompt) {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    return this.parseATSResponse(aiResponse);
  }

  async tryOpenRouterATS(prompt) {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );
    
    return this.parseATSResponse(response.data.choices[0].message.content);
  }

  async tryMistralATS(prompt) {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-tiny',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );
    
    return this.parseATSResponse(response.data.choices[0].message.content);
  }

  parseATSResponse(response) {
    try {
      // Try to parse as JSON first
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          score: parsed.score || 0,
          issues: Array.isArray(parsed.issues) ? parsed.issues : [],
          recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
          summary: parsed.summary || 'ATS analysis completed'
        };
      }
    } catch (error) {
      // Fallback to regex parsing
    }

    // Extract score
    const scoreMatch = response.match(/score["\s]*:?["\s]*(\d+)/i);
    const score = scoreMatch ? Math.min(parseInt(scoreMatch[1]), 100) : 50;

    // Extract issues
    const issuesMatch = response.match(/issues?["\s]*:?[\s]*\[([^\]]+)\]/i);
    const issues = issuesMatch ? 
      issuesMatch[1].split(',').map(i => i.replace(/["\']/g, '').trim()).filter(i => i.length > 0) : [];

    // Extract recommendations  
    const recsMatch = response.match(/recommendations?["\s]*:?[\s]*\[([^\]]+)\]/i);
    const recommendations = recsMatch ?
      recsMatch[1].split(',').map(r => r.replace(/["\']/g, '').trim()).filter(r => r.length > 0) : [];

    // Extract summary
    const summaryMatch = response.match(/summary["\s]*:?["\s]*([^"\n]+)/i);
    const summary = summaryMatch ? summaryMatch[1].trim() : this.generateATSSummary(score, issues.length);

    return { score, issues, recommendations, summary };
  }

  // Comprehensive technical checks as fallback
  performTechnicalChecks(resumeText) {
    const issues = [];
    const recommendations = [];
    let score = 100;

    // Contact Information Checks
    if (!/@/.test(resumeText)) {
      issues.push('No email address detected');
      recommendations.push('Include a professional email address at the top');
      score -= 15;
    }

    if (!/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(resumeText)) {
      issues.push('No phone number detected');
      recommendations.push('Include a phone number in standard format');
      score -= 10;
    }

    // Content Length and Structure
    if (resumeText.length < 500) {
      issues.push('Resume content appears too brief for ATS parsing');
      recommendations.push('Expand resume content with more detailed descriptions');
      score -= 20;
    }

    // Standard Sections Check
    const requiredSections = ['experience', 'education', 'skills'];
    const missingSections = requiredSections.filter(section => 
      !new RegExp(`\\b${section}\\b`, 'i').test(resumeText)
    );
    
    if (missingSections.length > 0) {
      issues.push(`Missing standard sections: ${missingSections.join(', ')}`);
      recommendations.push('Include standard resume sections with clear headers');
      score -= missingSections.length * 15;
    }

    // Formatting Issues
    if (resumeText.includes('\t') || resumeText.match(/\s{4,}/)) {
      issues.push('Inconsistent spacing detected');
      recommendations.push('Use consistent spacing and avoid excessive tabs');
      score -= 5;
    }

    // Date Format Check
    if (!/\b(19|20)\d{2}\b/.test(resumeText) && !/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/.test(resumeText)) {
      issues.push('No clear date formats found');
      recommendations.push('Include dates in standard format (MM/YYYY or Month YYYY)');
      score -= 10;
    }

    // Keywords Density Check
    const commonKeywords = ['manage', 'develop', 'create', 'implement', 'analyze', 'design', 'lead', 'coordinate'];
    const keywordCount = commonKeywords.filter(keyword => 
      new RegExp(`\\b${keyword}`, 'i').test(resumeText)
    ).length;
    
    if (keywordCount < 3) {
      issues.push('Limited action keywords detected');
      recommendations.push('Include more action verbs and industry keywords');
      score -= 10;
    }

    return {
      atsScore: Math.max(score, 0),
      issues,
      recommendations,
      summary: this.generateATSSummary(Math.max(score, 0), issues.length)
    };
  }



  generateATSSummary(score, issueCount) {
    if (score >= 85) {
      return `🟢 Excellent ATS compatibility! Your resume should pass through most ATS systems without issues.`;
    } else if (score >= 70) {
      return `🟡 Good ATS compatibility. ${issueCount} minor improvements recommended for optimal parsing.`;
    } else if (score >= 50) {
      return `🟠 Moderate ATS compatibility. ${issueCount} issues detected that may cause parsing problems.`;
    } else {
      return `🔴 Poor ATS compatibility. ${issueCount} critical issues need immediate attention to avoid rejection.`;
    }
  }

  // Comprehensive ATS tips for users
  getATSTips() {
    return [
      '📄 Use standard fonts: Arial, Calibri, Times New Roman (10-12pt)',
      '📝 Include clear section headers: Experience, Education, Skills, Contact',
      '🎯 Use relevant keywords from job descriptions naturally in context',
      '📧 Place contact information at the top in plain text format',
      '🚫 Avoid tables, text boxes, headers/footers, and complex graphics',
      '💼 Use bullet points with action verbs instead of long paragraphs',
      '📱 Save in both PDF and Word (.docx) formats for different systems',
      '🔍 Use standard job titles and well-known company names',
      '📅 Include dates in consistent MM/YYYY or Month YYYY format',
      '🎨 Stick to simple, clean formatting without fancy designs',
      '📏 Keep margins between 0.5-1 inch for proper parsing',
      '🔤 Avoid special characters, symbols, and unusual abbreviations'
    ];
  }
}

module.exports = new ATSService();