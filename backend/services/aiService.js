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


  // Truly AI-powered comprehensive analysis
  async analyzeResume(resumeText, jobDescription) {
    try {
      // Get AI-powered comprehensive analysis
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
    
    // Fallback to basic analysis if AI fails
    return this.getFallbackAnalysis(resumeText, jobDescription);
  }

  // AI-powered comprehensive analysis using multiple providers
  async getComprehensiveAIAnalysis(resumeText, jobDescription) {
    const prompt = `You are a BRUTAL and HONEST HR recruiter who REJECTS 90% of candidates. Analyze this resume against job requirements with ZERO mercy.

RESUME:
${resumeText.substring(0, 3000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 2000)}

RULES - BE RUTHLESSLY HONEST:
1. If JD says "5+ years" and resume shows 0-2 years → AUTOMATIC 10-20% score MAX
2. If JD says "Senior" and candidate is clearly junior → AUTOMATIC 15% score MAX  
3. If JD requires degree and candidate has none → AUTOMATIC 25% score MAX
4. If candidate has NO relevant work experience → AUTOMATIC 10% score MAX
5. Skills alone CANNOT save a completely unqualified candidate

DO NOT be diplomatic. DO NOT give false hope. BE BRUTAL like a real recruiter would be.

Examples of HONEST responses:
- "This candidate is completely unqualified for this senior role"
- "Zero relevant experience for a 5+ years requirement"
- "This is a junior applying for senior position - immediate rejection"

Respond in JSON format:
{
  "matchScore": number (0-100, BE BRUTAL - most should be 10-30%),
  "skillsMatch": ["skill1", "skill2"],
  "skillsGap": ["missing1", "missing2"],
  "experienceGap": "BRUTAL honest assessment - use words like 'completely lacks', 'zero experience', 'unqualified'",
  "educationGap": "BRUTAL education assessment",
  "seniorityMismatch": "BRUTAL seniority assessment - call out junior vs senior mismatch",
  "recommendations": ["HONEST recommendation like 'Do not apply to this role', 'Gain 3+ years experience first'"],
  "summary": "BRUTAL one-line summary - be harsh",
  "verdict": "QUALIFIED/UNDERQUALIFIED/COMPLETELY_UNQUALIFIED"
}`;

    // Try multiple AI providers for best results
    const providers = [
      () => this.tryGeminiAnalysis(prompt),
      () => this.tryOpenRouterAnalysis(prompt),
      () => this.tryMistralAnalysis(prompt),
      () => this.tryCohereAnalysis(prompt)
    ];

    for (const provider of providers) {
      try {
        const result = await provider();
        if (result) return result;
      } catch (error) {
        continue; // Try next provider
      }
    }
    
    return null; // All AI providers failed
  }

  async tryGeminiAnalysis(prompt) {
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
    return this.parseAIAnalysis(aiResponse);
  }

  async tryOpenRouterAnalysis(prompt) {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );
    
    return this.parseAIAnalysis(response.data.choices[0].message.content);
  }

  async tryMistralAnalysis(prompt) {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-tiny',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );
    
    return this.parseAIAnalysis(response.data.choices[0].message.content);
  }

  async tryCohereAnalysis(prompt) {
    const response = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: 'command-light',
        prompt: prompt,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );
    
    return this.parseAIAnalysis(response.data.generations[0].text);
  }

  parseAIAnalysis(response) {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Apply intelligent scoring logic
        const intelligentAnalysis = this.applyIntelligentScoring(parsed);
        
        return intelligentAnalysis;
      }
    } catch (error) {
      console.log('Failed to parse AI response:', error.message);
    }
    
    return null;
  }

  // Apply intelligent scoring that prioritizes eligibility over skills
  applyIntelligentScoring(parsed) {
    const skillsMatch = Array.isArray(parsed.skillsMatch) ? parsed.skillsMatch : [];
    const skillsGap = Array.isArray(parsed.skillsGap) ? parsed.skillsGap : [];
    let finalScore = Math.min(Math.max(parsed.matchScore || 0, 0), 100);
    let verdict = parsed.verdict || 'UNKNOWN';
    let blockingIssues = [];
    
    // Check for blocking eligibility issues
    const experienceText = (parsed.experienceGap || '').toLowerCase();
    const educationText = (parsed.educationGap || '').toLowerCase();
    const seniorityText = (parsed.seniorityMismatch || '').toLowerCase();
    
    // Experience blocking issues
    if (experienceText.includes('lacks') || experienceText.includes('insufficient') || 
        experienceText.includes('no experience') || experienceText.includes('fresher') ||
        experienceText.includes('underqualified') || experienceText.includes('years short')) {
      blockingIssues.push('EXPERIENCE_INSUFFICIENT');
    }
    
    // Education blocking issues  
    if (educationText.includes('does not meet') || educationText.includes('lacks') ||
        educationText.includes('insufficient') || educationText.includes('required degree')) {
      blockingIssues.push('EDUCATION_INSUFFICIENT');
    }
    
    // Seniority blocking issues
    if (seniorityText.includes('too junior') || seniorityText.includes('not senior enough') ||
        seniorityText.includes('lacks leadership') || seniorityText.includes('inappropriate level')) {
      blockingIssues.push('SENIORITY_MISMATCH');
    }
    
    // Apply BRUTAL scoring for unqualified candidates
    if (blockingIssues.length > 0) {
      // If basic eligibility is not met, skills are irrelevant
      if (blockingIssues.includes('EXPERIENCE_INSUFFICIENT')) {
        finalScore = Math.min(finalScore, 15); // BRUTAL cap for experience issues
        verdict = 'COMPLETELY_UNQUALIFIED';
      }
      
      if (blockingIssues.includes('EDUCATION_INSUFFICIENT')) {
        finalScore = Math.min(finalScore, 20); // BRUTAL cap for education issues
        verdict = 'COMPLETELY_UNQUALIFIED';
      }
      
      if (blockingIssues.includes('SENIORITY_MISMATCH')) {
        finalScore = Math.min(finalScore, 18); // BRUTAL cap for seniority issues
        verdict = 'COMPLETELY_UNQUALIFIED';
      }
      
      // Multiple blocking issues = almost zero score
      if (blockingIssues.length >= 2) {
        finalScore = Math.min(finalScore, 8); // BRUTAL - almost zero
        verdict = 'COMPLETELY_UNQUALIFIED';
      }
      
      // Special case: No experience mentioned at all for experienced role
      if (experienceText.includes('no experience') || experienceText.includes('zero experience') || 
          experienceText.includes('completely lacks')) {
        finalScore = Math.min(finalScore, 5); // BRUTAL - almost zero
        verdict = 'COMPLETELY_UNQUALIFIED';
      }
    }
    
    // Generate comprehensive breakdown
    const breakdown = this.generateIntelligentBreakdown({
      skillsMatch,
      skillsGap,
      blockingIssues,
      originalScore: parsed.matchScore,
      finalScore,
      experienceGap: parsed.experienceGap,
      educationGap: parsed.educationGap,
      seniorityMismatch: parsed.seniorityMismatch
    });
    
    return {
      matchScore: finalScore,
      skillsMatch,
      skillsGap,
      experienceGap: parsed.experienceGap || 'No experience analysis available',
      educationGap: parsed.educationGap || 'No education analysis available', 
      seniorityMismatch: parsed.seniorityMismatch || 'No seniority analysis available',
      recommendations: this.generateIntelligentRecommendations(blockingIssues, skillsGap, finalScore),
      summary: breakdown.summary,
      verdict,
      blockingIssues,
      breakdown,
      strengths: skillsMatch.slice(0, 5),
      improvements: skillsGap.slice(0, 5)
    };
  }

  generateIntelligentBreakdown({skillsMatch, skillsGap, blockingIssues, originalScore, finalScore, experienceGap, educationGap, seniorityMismatch}) {
    const breakdown = {
      eligibilityScore: 0,
      skillScore: 0,
      overallScore: finalScore,
      primaryConcerns: [],
      summary: ''
    };
    
    // Calculate eligibility score (experience + education + seniority)
    if (blockingIssues.length === 0) {
      breakdown.eligibilityScore = 85; // Good eligibility
    } else if (blockingIssues.length === 1) {
      breakdown.eligibilityScore = 40; // Some eligibility issues
    } else {
      breakdown.eligibilityScore = 15; // Major eligibility issues
    }
    
    // Calculate skill score
    const totalSkills = skillsMatch.length + skillsGap.length;
    breakdown.skillScore = totalSkills > 0 ? Math.round((skillsMatch.length / totalSkills) * 100) : 0;
    
    // Identify primary concerns
    if (blockingIssues.includes('EXPERIENCE_INSUFFICIENT')) {
      breakdown.primaryConcerns.push('Insufficient work experience for this role');
    }
    if (blockingIssues.includes('EDUCATION_INSUFFICIENT')) {
      breakdown.primaryConcerns.push('Education requirements not met');
    }
    if (blockingIssues.includes('SENIORITY_MISMATCH')) {
      breakdown.primaryConcerns.push('Seniority level inappropriate for this position');
    }
    
    // Generate BRUTAL summary
    if (blockingIssues.length === 0) {
      breakdown.summary = `✅ Meets basic eligibility. Skills: ${breakdown.skillScore}%. Qualified candidate.`;
    } else if (blockingIssues.length === 1) {
      breakdown.summary = `❌ ${breakdown.primaryConcerns[0]}. DO NOT APPLY to this role.`;
    } else {
      breakdown.summary = `❌ COMPLETELY UNQUALIFIED: ${breakdown.primaryConcerns.join(', ').toLowerCase()}. Immediate rejection.`;
    }
    
    return breakdown;
  }

  generateIntelligentRecommendations(blockingIssues, skillsGap, finalScore) {
    const recommendations = [];
    
    // BRUTAL recommendations based on blocking issues
    if (blockingIssues.includes('EXPERIENCE_INSUFFICIENT')) {
      recommendations.push('🚫 DO NOT APPLY: You lack the required work experience');
      recommendations.push('💡 REALITY CHECK: Gain 3-5 years experience in junior roles first');
    }
    
    if (blockingIssues.includes('EDUCATION_INSUFFICIENT')) {
      recommendations.push('🚫 DO NOT APPLY: Education requirements not met');
      recommendations.push('💡 REALITY CHECK: Complete required degree/certification first');
    }
    
    if (blockingIssues.includes('SENIORITY_MISMATCH')) {
      recommendations.push('🚫 DO NOT APPLY: This is a senior role, you are junior level');
      recommendations.push('💡 REALITY CHECK: Apply to junior/mid-level positions instead');
    }
    
    // Overall BRUTAL guidance
    if (finalScore < 20) {
      recommendations.push('🚫 BRUTAL TRUTH: You are completely unqualified for this role');
      recommendations.push('💡 HONEST ADVICE: Do not waste time applying - focus on building basics');
    } else if (finalScore < 40) {
      recommendations.push('🚫 BRUTAL TRUTH: You are significantly underqualified');
      recommendations.push('💡 HONEST ADVICE: Need 2-3 years more preparation before applying');
    }
    
    // Skills are secondary when unqualified
    if (blockingIssues.length > 0 && skillsGap.length > 0) {
      recommendations.push(`📚 Secondary priority: Learn ${skillsGap.slice(0, 2).join(', ')} while gaining experience`);
    }
    
    return recommendations;
  }

  // Fallback analysis if all AI providers fail
  getFallbackAnalysis(resumeText, jobDescription) {
    const resumeSkills = this.extractSkills(resumeText);
    const jdSkills = this.extractSkills(jobDescription);
    
    const skillsMatch = resumeSkills.filter(skill => 
      jdSkills.some(jdSkill => jdSkill.includes(skill) || skill.includes(jdSkill))
    );
    
    const skillsGap = jdSkills.filter(skill => 
      !resumeSkills.some(resumeSkill => resumeSkill.includes(skill) || skill.includes(resumeSkill))
    );
    
    // Conservative scoring for fallback
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

    return {
      analysis,
      aiReport: 'AI analysis temporarily unavailable. Using basic skill matching.',
      fallbackReport: this.generateFallbackReport(analysis),
      aiProvider: 'Fallback Algorithm',
      atsAnalysis: null
    };
  }

  generateComprehensiveRecommendations({skillsGap, experienceAnalysis, educationAnalysis, seniorityAnalysis, matchScore}) {
    const recommendations = [];
    
    // Experience recommendations
    if (experienceAnalysis.gap > 0) {
      if (experienceAnalysis.gap >= 3) {
        recommendations.push(`⚠️ This role requires ${experienceAnalysis.required}+ years experience. You may be underqualified.`);
        recommendations.push('Consider applying to more junior positions to build experience first.');
      } else {
        recommendations.push(`You need ${experienceAnalysis.gap} more years of experience. Highlight relevant projects and internships.`);
      }
    }
    
    // Education recommendations
    if (educationAnalysis.gap > 0) {
      recommendations.push('Consider pursuing additional education or certifications to meet the requirements.');
    }
    
    // Seniority recommendations
    if (seniorityAnalysis.mismatch > 1) {
      if (seniorityAnalysis.candidate < seniorityAnalysis.required) {
        recommendations.push('This appears to be a senior-level role. Consider gaining more leadership experience.');
      } else {
        recommendations.push('You may be overqualified for this position. Consider more senior roles.');
      }
    }
    
    // Skill recommendations
    if (skillsGap.length > 0) {
      skillsGap.slice(0, 3).forEach(skill => {
        recommendations.push(`Learn ${skill} through courses or practical projects`);
      });
    }
    
    // Overall recommendations
    if (matchScore < 60) {
      recommendations.push('Consider looking for roles that better match your current experience level.');
    }
    
    return recommendations;
  }

  generateRealisticSummary({matchScore, skillsMatch, skillsGap, experienceAnalysis, educationAnalysis, seniorityAnalysis}) {
    let summary = '';
    
    if (matchScore >= 80) {
      summary = `🎯 Strong match! You meet most requirements for this role.`;
    } else if (matchScore >= 60) {
      summary = `✅ Good potential match with some gaps to address.`;
    } else if (matchScore >= 40) {
      summary = `⚠️ Partial match. Significant gaps in requirements.`;
    } else {
      summary = `❌ Poor match. This role may not be suitable for your current profile.`;
    }
    
    // Add specific concerns
    const concerns = [];
    if (experienceAnalysis.gap > 2) {
      concerns.push(`${experienceAnalysis.gap} years experience gap`);
    }
    if (!educationAnalysis.sufficient) {
      concerns.push('education requirements not met');
    }
    if (seniorityAnalysis.mismatch > 1) {
      concerns.push('seniority level mismatch');
    }
    
    if (concerns.length > 0) {
      summary += ` Key concerns: ${concerns.join(', ')}.`;
    }
    
    return summary;
  }
}

module.exports = new AIService();