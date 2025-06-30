const axios = require('axios');

class ATSService {
  // AI-powered ATS compatibility analysis
  async checkATSCompatibility(resumeText, jobDescription = '') {
    try {
      // Use AI to analyze ATS compatibility
      const aiAnalysis = await this.getAIATSAnalysis(resumeText, jobDescription);
      
      // Combine AI analysis with technical checks for better accuracy
      const technicalChecks = this.performTechnicalChecks(resumeText);
      
      return {
        atsScore: aiAnalysis.score || technicalChecks.atsScore,
        issues: [...(aiAnalysis.issues || []), ...technicalChecks.issues],
        recommendations: [...(aiAnalysis.recommendations || []), ...technicalChecks.recommendations],
        summary: aiAnalysis.summary || technicalChecks.summary,
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
    const prompt = `You are an ATS (Applicant Tracking System) parsing expert with 10+ years experience. Analyze this resume like a REAL ATS system would.

RESUME CONTENT:
${resumeText.substring(0, 3000)}

${jobDescription ? `TARGET JOB:
${jobDescription.substring(0, 1000)}

` : ''}CRITICAL ATS ANALYSIS - BE BRUTALLY HONEST:

1. PARSING ABILITY (40% of score):
   - Can ATS extract contact info cleanly?
   - Are section headers standard and recognizable?
   - Is text readable without complex formatting?
   - Are dates in parseable format?

2. KEYWORD MATCHING (35% of score):
   - Does resume contain job-relevant keywords?
   - Are skills mentioned in standard terminology?
   - Are job titles using industry-standard names?
   - Is there keyword stuffing (penalty)?

3. STRUCTURE & FORMAT (25% of score):
   - Standard resume sections present?
   - Logical flow and organization?
   - No graphics/tables that break parsing?
   - Consistent formatting throughout?

REAL ATS BEHAVIOR:
- ATS systems FAIL to parse 75% of resumes properly
- Complex formatting = automatic rejection
- Missing keywords = filtered out immediately
- Non-standard sections = parsing errors

BE REALISTIC: Most resumes score 40-60% in real ATS systems.

Respond in JSON:
{
  "score": number (20-90, be realistic - most should be 40-70),
  "issues": ["specific parsing problems ATS would have"],
  "recommendations": ["exact fixes to pass ATS parsing"],
  "summary": "honest assessment of ATS parsing likelihood",
  "keywordMatch": number (0-100),
  "parseability": number (0-100)
}`;

    // Use Gemini first (best for detailed analysis)
    try {
      console.log('Using Gemini for intelligent ATS analysis...');
      const result = await this.tryGeminiATS(prompt);
      if (result && result.score !== undefined) {
        console.log('Gemini ATS analysis successful!');
        return this.validateATSResult(result);
      }
    } catch (error) {
      console.log('Gemini ATS failed:', error.message);
    }

    // Fallback to OpenRouter
    try {
      console.log('Trying OpenRouter for ATS analysis...');
      const result = await this.tryOpenRouterATS(prompt);
      if (result && result.score !== undefined) {
        console.log('OpenRouter ATS analysis successful!');
        return this.validateATSResult(result);
      }
    } catch (error) {
      console.log('OpenRouter ATS failed:', error.message);
    }
    
    throw new Error('AI ATS analysis failed');
  }

  validateATSResult(result) {
    // Ensure realistic scoring
    let score = Math.min(Math.max(result.score || 50, 20), 90);
    
    // Apply realistic constraints
    if (score > 80 && (!result.issues || result.issues.length === 0)) {
      score = Math.min(score, 75); // Perfect scores are rare
    }
    
    if (score < 30 && result.issues && result.issues.length < 3) {
      score = Math.max(score, 35); // Very low scores need multiple issues
    }
    
    return {
      score,
      issues: result.issues || [],
      recommendations: result.recommendations || [],
      summary: result.summary || this.generateATSSummary(score, result.issues?.length || 0),
      keywordMatch: result.keywordMatch || Math.max(score - 20, 0),
      parseability: result.parseability || Math.max(score - 10, 0)
    };
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

  async tryCohereATS(prompt) {
    const response = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: 'command-light',
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );
    
    return this.parseATSResponse(response.data.generations[0].text);
  }

  parseATSResponse(response) {
    try {
      // Try to parse as JSON first
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          score: Math.min(Math.max(parsed.score || 0, 0), 100),
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



  // Realistic ATS technical validation
  performTechnicalChecks(resumeText) {
    const issues = [];
    const recommendations = [];
    let score = 65; // Start with realistic baseline

    // CRITICAL: Contact Information (ATS must find this)
    const hasEmail = /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
    const hasPhone = /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(resumeText);
    
    if (!hasEmail) {
      issues.push('ATS cannot locate email address - will be rejected');
      recommendations.push('Add email in clear format: john.doe@email.com');
      score -= 25;
    }
    
    if (!hasPhone) {
      issues.push('Phone number not in ATS-readable format');
      recommendations.push('Add phone: (555) 123-4567 or 555-123-4567');
      score -= 15;
    }

    // CRITICAL: Standard Section Headers
    const standardSections = {
      'experience': /\b(experience|employment|work history|professional experience)\b/i,
      'education': /\b(education|academic|degree|university|college)\b/i,
      'skills': /\b(skills|technical skills|competencies|proficiencies)\b/i
    };
    
    Object.entries(standardSections).forEach(([section, regex]) => {
      if (!regex.test(resumeText)) {
        issues.push(`Missing "${section.toUpperCase()}" section header - ATS will not categorize content`);
        recommendations.push(`Add clear section header: "${section.toUpperCase()}"`);
        score -= 12;
      }
    });

    // PARSING KILLERS: Complex formatting indicators
    const complexFormatting = [
      { pattern: /\|{2,}/, issue: 'Table formatting detected', penalty: 15 },
      { pattern: /_{5,}/, issue: 'Underline formatting detected', penalty: 10 },
      { pattern: /\*{3,}/, issue: 'Asterisk formatting detected', penalty: 8 },
      { pattern: /={3,}/, issue: 'Equals sign formatting detected', penalty: 8 }
    ];
    
    complexFormatting.forEach(({ pattern, issue, penalty }) => {
      if (pattern.test(resumeText)) {
        issues.push(`${issue} - ATS parsing will fail`);
        recommendations.push('Remove complex formatting, use simple text');
        score -= penalty;
      }
    });

    // KEYWORD DENSITY: Too few = filtered out
    const actionVerbs = ['managed', 'developed', 'created', 'implemented', 'analyzed', 'designed', 'led', 'coordinated', 'built', 'improved'];
    const verbCount = actionVerbs.filter(verb => new RegExp(`\\b${verb}`, 'i').test(resumeText)).length;
    
    if (verbCount < 3) {
      issues.push('Insufficient action verbs - ATS keyword matching will fail');
      recommendations.push('Add action verbs: managed, developed, implemented, etc.');
      score -= 12;
    }

    // DATE FORMAT: ATS struggles with non-standard dates
    const hasStandardDates = /\b(0[1-9]|1[0-2])\/(19|20)\d{2}\b/.test(resumeText) || 
                            /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(19|20)\d{2}\b/i.test(resumeText);
    
    if (!hasStandardDates && resumeText.length > 500) {
      issues.push('Non-standard date formats detected');
      recommendations.push('Use MM/YYYY or "Jan 2023" format for dates');
      score -= 8;
    }

    // CONTENT LENGTH: Too short = insufficient data
    if (resumeText.length < 800) {
      issues.push('Resume too brief - ATS needs more content to parse effectively');
      recommendations.push('Expand descriptions with specific achievements and metrics');
      score -= 15;
    }

    return {
      atsScore: Math.max(Math.min(score, 85), 15), // Realistic range
      issues,
      recommendations,
      summary: this.generateATSSummary(Math.max(Math.min(score, 85), 15), issues.length)
    };
  }



  generateATSSummary(score, issueCount) {
    if (score >= 75) {
      return `🟢 Strong ATS compatibility (${score}%). Your resume should parse well in most ATS systems. ${issueCount} minor optimizations available.`;
    } else if (score >= 60) {
      return `🟡 Moderate ATS compatibility (${score}%). ${issueCount} issues may cause parsing problems in some ATS systems.`;
    } else if (score >= 40) {
      return `🟠 Poor ATS compatibility (${score}%). ${issueCount} critical issues will likely cause parsing failures.`;
    } else {
      return `🔴 Very poor ATS compatibility (${score}%). ${issueCount} major issues will cause automatic rejection by most ATS systems.`;
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