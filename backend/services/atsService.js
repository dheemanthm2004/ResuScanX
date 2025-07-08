const AIProviders = require('./ai/providers');

class ATSService {
  constructor() {
    this.providers = new AIProviders();
  }

  async checkATSCompatibility(resumeText, jobDescription = '') {
    try {
      const aiAnalysis = await this.getAIATSAnalysis(resumeText, jobDescription);
      const technicalChecks = this.performTechnicalChecks(resumeText);
      
      return {
        atsScore: aiAnalysis.score || technicalChecks.atsScore,
        issues: [...(aiAnalysis.issues || []), ...technicalChecks.issues],
        recommendations: [...(aiAnalysis.recommendations || []), ...technicalChecks.recommendations],
        summary: aiAnalysis.summary || technicalChecks.summary,
        aiPowered: !!aiAnalysis.score,
        aiProvider: aiAnalysis.provider || 'Technical Analysis'
      };
    } catch (error) {
      console.log('AI ATS analysis failed, using technical checks:', error.message);
      const technicalChecks = this.performTechnicalChecks(resumeText);
      return {
        ...technicalChecks,
        aiPowered: false,
        aiProvider: 'Fallback Analysis'
      };
    }
  }

  async getAIATSAnalysis(resumeText, jobDescription) {
    const prompt = `You are an ATS parsing expert analyzing resume compatibility. Be realistic about ATS limitations.

RESUME:
${resumeText.substring(0, 3500)}

${jobDescription ? `JOB POSTING:
${jobDescription.substring(0, 1200)}

` : ''}ATS REALITY CHECK:

1. PARSING SUCCESS (40%):
   - Contact info extractable?
   - Standard section headers?
   - Clean text without complex formatting?
   - Readable dates and structure?

2. KEYWORD OPTIMIZATION (35%):
   - Job-relevant keywords present?
   - Industry-standard terminology?
   - Natural keyword integration?
   - Avoiding keyword stuffing?

3. FORMAT COMPATIBILITY (25%):
   - Standard resume structure?
   - No parsing-breaking elements?
   - Consistent formatting?
   - ATS-friendly layout?

REAL ATS STATISTICS:
- 75% of resumes fail initial ATS parsing
- Complex formatting causes 60% of rejections
- Missing keywords filter out 80% of candidates
- Only 25% of resumes score above 70%

Be BRUTALLY realistic - most resumes score 35-65%.

JSON response:
{
  "score": number (25-85, realistic range),
  "issues": ["specific ATS parsing problems"],
  "recommendations": ["actionable fixes for ATS compatibility"],
  "summary": "honest ATS compatibility assessment",
  "keywordDensity": number,
  "parseability": number
}`;

    this.providers.reset();
    
    while (this.providers.currentIndex < this.providers.providers.length) {
      const provider = this.providers.getNext();
      if (!provider || !provider.key) continue;
      
      try {
        console.log(`Trying ${provider.name} for ATS analysis...`);
        const result = await this.providers.call(provider.type, prompt, provider.key);
        
        if (result) {
          const validated = this.validateATSResult(this.parseATSResponse(result));
          if (validated && validated.score !== undefined) {
            console.log(`${provider.name} ATS analysis successful!`);
            validated.provider = provider.name;
            return validated;
          }
        }
      } catch (error) {
        console.log(`${provider.name} ATS failed:`, error.message);
        continue;
      }
    }
    
    throw new Error('All AI providers failed for ATS analysis');
  }

  parseATSResponse(response) {
    try {
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

    const scoreMatch = response.match(/score["\s]*:?["\s]*(\d+)/i);
    const score = scoreMatch ? Math.min(parseInt(scoreMatch[1]), 100) : 50;

    const issuesMatch = response.match(/issues?["\s]*:?[\s]*\[([^\]]+)\]/i);
    const issues = issuesMatch ? 
      issuesMatch[1].split(',').map(i => i.replace(/["']/g, '').trim()).filter(i => i.length > 0) : [];

    const recsMatch = response.match(/recommendations?["\s]*:?[\s]*\[([^\]]+)\]/i);
    const recommendations = recsMatch ?
      recsMatch[1].split(',').map(r => r.replace(/["']/g, '').trim()).filter(r => r.length > 0) : [];

    const summaryMatch = response.match(/summary["\s]*:?["\s]*([^"\n]+)/i);
    const summary = summaryMatch ? summaryMatch[1].trim() : this.generateATSSummary(score, issues.length);

    return { score, issues, recommendations, summary };
  }

  validateATSResult(result) {
    let score = Math.min(Math.max(result.score || 50, 20), 90);
    
    if (score > 80 && (!result.issues || result.issues.length === 0)) {
      score = Math.min(score, 75);
    }
    
    if (score < 30 && result.issues && result.issues.length < 3) {
      score = Math.max(score, 35);
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

  performTechnicalChecks(resumeText) {
    const issues = [];
    const recommendations = [];
    let score = 65;

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

    const actionVerbs = ['managed', 'developed', 'created', 'implemented', 'analyzed', 'designed', 'led', 'coordinated', 'built', 'improved'];
    const verbCount = actionVerbs.filter(verb => new RegExp(`\\b${verb}`, 'i').test(resumeText)).length;
    
    if (verbCount < 3) {
      issues.push('Insufficient action verbs - ATS keyword matching will fail');
      recommendations.push('Add action verbs: managed, developed, implemented, etc.');
      score -= 12;
    }

    const hasStandardDates = /\b(0[1-9]|1[0-2])\/(19|20)\d{2}\b/.test(resumeText) || 
                            /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(19|20)\d{2}\b/i.test(resumeText);
    
    if (!hasStandardDates && resumeText.length > 500) {
      issues.push('Non-standard date formats detected');
      recommendations.push('Use MM/YYYY or "Jan 2023" format for dates');
      score -= 8;
    }

    if (resumeText.length < 800) {
      issues.push('Resume too brief - ATS needs more content to parse effectively');
      recommendations.push('Expand descriptions with specific achievements and metrics');
      score -= 15;
    }

    return {
      atsScore: Math.max(Math.min(score, 85), 15),
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