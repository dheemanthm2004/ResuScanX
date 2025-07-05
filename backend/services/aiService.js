const AIProviders = require('./ai/providers');
const SkillExtractor = require('./ai/skillExtractor');
const RealisticScorer = require('./ai/scorer');
const AIPrompts = require('./ai/prompts');
const atsService = require('./atsService');

class AIService {
  constructor() {
    this.providers = new AIProviders();
    this.skillExtractor = new SkillExtractor();
    this.scorer = new RealisticScorer();
  }

  async analyzeResume(resumeText, jobDescription) {
    try {
      const aiAnalysis = await this.getComprehensiveAIAnalysis(resumeText, jobDescription);
      
      if (aiAnalysis) {
        const reports = await this.generateAIReport(resumeText, jobDescription, aiAnalysis);
        const atsAnalysis = await atsService.checkATSCompatibility(resumeText, jobDescription);
        
        return {
          analysis: aiAnalysis,
          aiReport: reports.aiReport,
          fallbackReport: reports.fallbackReport,
          aiProvider: reports.aiProvider,
          atsAnalysis
        };
      }
    } catch (error) {
      console.log('AI analysis failed, using fallback:', error.message);
    }
    
    return this.getFallbackAnalysis(resumeText, jobDescription);
  }

  async getComprehensiveAIAnalysis(resumeText, jobDescription) {
    console.log('Starting AI analysis with provider rotation...');
    this.providers.reset();
    
    const prompt = AIPrompts.getAnalysisPrompt(resumeText, jobDescription);

    while (this.providers.currentIndex < this.providers.providers.length) {
      const provider = this.providers.getNext();
      if (!provider || !provider.key) continue;
      
      try {
        console.log(`Trying ${provider.name}...`);
        const result = await this.providers.call(provider.type, prompt, provider.key);
        
        if (result) {
          const parsed = this.processAIResponse(result, resumeText, jobDescription, provider.name);
          if (parsed) {
            console.log(`${provider.name} analysis successful!`);
            return parsed;
          }
        }
      } catch (error) {
        console.log(`${provider.name} failed:`, error.message);
        continue;
      }
    }
    
    console.log('All AI providers failed');
    return null;
  }

  processAIResponse(response, resumeText, jobDescription, providerName) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return this.scorer.applyScoring(parsed, resumeText, jobDescription, providerName);
      }
    } catch (error) {
      console.log(`Failed to parse ${providerName} response:`, error.message);
    }
    
    return null;
  }

  async generateAIReport(resumeText, jobDescription, analysis) {
    const prompt = AIPrompts.getDetailedReportPrompt(resumeText, jobDescription, analysis);
    this.providers.reset();
    
    while (this.providers.currentIndex < this.providers.providers.length) {
      const provider = this.providers.getNext();
      if (!provider || !provider.key) continue;
      
      try {
        console.log(`Generating detailed report with ${provider.name}...`);
        const aiReport = await this.providers.call(provider.type, prompt, provider.key);
        
        if (aiReport && aiReport.length > 500) {
          console.log(`${provider.name} detailed report successful!`);
          return {
            aiReport,
            fallbackReport: this.generateFallbackReport(analysis),
            aiProvider: `${provider.name} Detailed Analysis`
          };
        }
      } catch (error) {
        console.log(`${provider.name} detailed report failed:`, error.message);
        continue;
      }
    }

    console.log('All providers failed for detailed report');
    return {
      aiReport: '🤖 AI detailed analysis temporarily unavailable - all providers exhausted',
      fallbackReport: this.generateFallbackReport(analysis),
      aiProvider: 'Intelligent Fallback System'
    };
  }

  async chatWithAI(context) {
    this.providers.reset();
    
    while (this.providers.currentIndex < this.providers.providers.length) {
      const provider = this.providers.getNext();
      if (!provider || !provider.key) continue;
      
      try {
        const response = await this.providers.call(provider.type, context, provider.key);
        if (response && response.length > 10) {
          return response;
        }
      } catch (error) {
        console.log(`${provider.name} chat failed:`, error.message);
        continue;
      }
    }
    
    return "I'm here to help with your resume analysis! All AI providers are currently busy, but I can still provide general career advice based on your analysis results.";
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

    return `
🎯 PROFESSIONAL ANALYSIS REPORT

📊 VERDICT: ${verdict} (${analysis.matchScore}%)


✅ KEY STRENGTHS:
${analysis.skillsMatch.slice(0, 6).map(skill => `• ${skill.toUpperCase()}`).join('\n')}


❌ SKILLS TO DEVELOP:
${analysis.skillsGap.slice(0, 6).map(skill => `• ${skill.toUpperCase()}`).join('\n')}


💡 STRATEGIC RECOMMENDATIONS:
${analysis.recommendations.map(rec => `• ${rec}`).join('\n')}


🎯 NEXT STEPS:
• ${recommendation}
• Update your resume to highlight matching skills
• Prepare examples demonstrating your relevant experience
• Consider building projects using the missing technologies


📈 INTERVIEW PREPARATION:
• Focus on your ${analysis.skillsMatch.slice(0, 3).join(', ')} experience
• Be ready to discuss how you can quickly learn ${analysis.skillsGap.slice(0, 2).join(' and ')}
• Highlight your adaptability and learning mindset
    `;
  }

  async getFallbackAnalysis(resumeText, jobDescription) {
    const resumeSkills = this.skillExtractor.extract(resumeText);
    const jdSkills = this.skillExtractor.extract(jobDescription);
    
    const skillsMatch = resumeSkills.filter(skill => 
      jdSkills.some(jdSkill => jdSkill.includes(skill) || skill.includes(jdSkill))
    );
    
    const skillsGap = jdSkills.filter(skill => 
      !resumeSkills.some(resumeSkill => resumeSkill.includes(skill) || skill.includes(resumeSkill))
    );
    
    const matchScore = skillsMatch.length > 0 ? 
      Math.min((skillsMatch.length / Math.max(jdSkills.length, 1)) * 70, 70) : 20;
    
    const analysis = {
      matchScore: Math.round(matchScore),
      skillsMatch,
      skillsGap,
      experienceGap: 'AI analysis unavailable - manual review recommended',
      educationGap: 'AI analysis unavailable - manual review recommended', 
      seniorityMismatch: 'AI analysis unavailable - manual review recommended',
      recommendations: [
        'AI analysis temporarily unavailable',
        'Please manually review experience and education requirements',
        ...skillsGap.slice(0, 2).map(skill => `Consider learning ${skill}`)
      ],
      summary: `Basic skill analysis: ${skillsMatch.length} matches, ${skillsGap.length} gaps. Full AI analysis unavailable.`,
      verdict: 'REQUIRES_MANUAL_REVIEW',
      strengths: skillsMatch.slice(0, 5),
      improvements: skillsGap.slice(0, 5)
    };

    const atsAnalysis = await atsService.checkATSCompatibility(resumeText, jobDescription);

    return {
      analysis,
      aiReport: 'AI analysis temporarily unavailable. Using basic skill matching.',
      fallbackReport: this.generateFallbackReport(analysis),
      aiProvider: 'Fallback Algorithm',
      atsAnalysis
    };
  }
}

module.exports = new AIService();