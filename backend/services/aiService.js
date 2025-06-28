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

  // Generate detailed AI reports with full resume and JD analysis
  async generateAIReport(resumeText, jobDescription, analysis) {
    const detailedPrompt = `COMPREHENSIVE RESUME ANALYSIS REPORT

FULL RESUME CONTENT:
${resumeText.substring(0, 4000)}

FULL JOB DESCRIPTION:
${jobDescription.substring(0, 2500)}

CURRENT ANALYSIS SUMMARY:
- Match Score: ${analysis.matchScore}%
- Skills Match: ${analysis.skillsMatch?.join(', ') || 'None'}
- Skills Gap: ${analysis.skillsGap?.join(', ') || 'None'}
- Verdict: ${analysis.verdict}

Provide a DETAILED, COMPREHENSIVE analysis covering:

1. EXPERIENCE ANALYSIS (200+ words):
   - Analyze candidate's work history in detail
   - Compare with job requirements
   - Identify experience gaps or strengths
   - Assess career progression

2. SKILLS ASSESSMENT (200+ words):
   - Deep dive into technical skills match
   - Evaluate skill levels and proficiency
   - Identify critical missing skills
   - Suggest skill development priorities

3. EDUCATION & QUALIFICATIONS (150+ words):
   - Review educational background
   - Assess relevance to role requirements
   - Identify certification needs
   - Evaluate academic achievements

4. ROLE SUITABILITY (200+ words):
   - Overall fit for the specific position
   - Seniority level appropriateness
   - Cultural and team fit assessment
   - Growth potential in the role

5. ACTIONABLE RECOMMENDATIONS (200+ words):
   - Specific steps to improve candidacy
   - Timeline for skill development
   - Alternative career paths if unsuitable
   - Interview preparation advice

6. HONEST VERDICT (100+ words):
   - Final recommendation (Hire/Don't Hire/Maybe)
   - Key reasons for decision
   - Probability of success in role

Total response should be 1000+ words. Be detailed, specific, and reference actual content from the resume and job description.`;

    const reports = await Promise.allSettled([
      this.tryDetailedOpenRouter(detailedPrompt),
      this.tryDetailedMistral(detailedPrompt),
      this.tryDetailedCohere(detailedPrompt),
      this.tryDetailedGemini(detailedPrompt)
    ]);

    const aiReport = reports.find(r => r.status === 'fulfilled')?.value;
    const fallbackReport = this.generateFallbackReport(analysis);

    return {
      aiReport: aiReport || '🤖 AI analysis temporarily unavailable - all providers failed',
      fallbackReport,
      aiProvider: aiReport ? 'Multi-AI Detailed Analysis' : 'Intelligent Fallback'
    };
  }

  async tryDetailedOpenRouter(prompt) {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );
    return response.data.choices[0].message.content;
  }

  async tryDetailedMistral(prompt) {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-tiny',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1200,
        temperature: 0.6
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );
    return response.data.choices[0].message.content;
  }

  async tryDetailedCohere(prompt) {
    const response = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: 'command-light',
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.6
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );
    return response.data.generations[0].text;
  }

  async tryDetailedGemini(prompt) {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 20000
      }
    );
    return response.data.candidates[0].content.parts[0].text;
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
    console.log('Starting AI analysis...');
    const prompt = `You are an experienced HR recruiter analyzing resume-job fit. Be realistic - no resume is 100% perfect match.

RESUME:
${resumeText.substring(0, 3000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 2000)}

ANALYSIS RULES:
1. MAJOR BLOCKERS (give low scores 10-30%):
   - Zero relevant work experience for experienced roles (3+ years required)
   - Completely wrong seniority level (junior applying for senior/lead roles)
   - Missing critical education requirements (degree required but none)

2. MINOR GAPS (acceptable, give decent scores 60-85%):
   - Missing 1-2 technical skills (can be learned)
   - 1-2 years experience gap (close enough)
   - Different but related background
   - Some missing nice-to-have requirements

3. GOOD MATCHES (give high scores 80-95%):
   - Meets core requirements with minor gaps
   - Relevant experience even if not exact
   - Transferable skills from related roles

Be REALISTIC - most decent candidates should score 60-85%. Only completely unqualified candidates get below 30%.

Respond in JSON format:
{
  "matchScore": number (0-100, be realistic - most should be 60-85%),
  "skillsMatch": ["skill1", "skill2"],
  "skillsGap": ["missing1", "missing2"],
  "experienceGap": "realistic assessment of experience match",
  "educationGap": "realistic education assessment",
  "seniorityMismatch": "realistic seniority level assessment",
  "recommendations": ["practical recommendations for improvement"],
  "summary": "balanced, realistic summary",
  "verdict": "QUALIFIED/UNDERQUALIFIED/COMPLETELY_UNQUALIFIED"
}`;

    // Try multiple AI providers for best results
    const providers = [
      { name: 'Gemini', fn: () => this.tryGeminiAnalysis(prompt) },
      { name: 'OpenRouter', fn: () => this.tryOpenRouterAnalysis(prompt) },
      { name: 'Mistral', fn: () => this.tryMistralAnalysis(prompt) },
      { name: 'Cohere', fn: () => this.tryCohereAnalysis(prompt) }
    ];

    for (const provider of providers) {
      try {
        console.log(`Trying ${provider.name} AI provider...`);
        const result = await provider.fn();
        if (result) {
          console.log(`${provider.name} AI analysis successful!`);
          return result;
        }
        console.log(`${provider.name} returned null result`);
      } catch (error) {
        console.log(`${provider.name} AI provider failed:`, error.message);
        continue; // Try next provider
      }
    }
    
    console.log('All AI providers failed');
    return null; // All AI providers failed
  }

  async tryGeminiAnalysis(prompt) {
    try {
      console.log('Making Gemini API call...');
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

      console.log('Gemini API response received');
      const aiResponse = response.data.candidates[0].content.parts[0].text;
      console.log('AI Response:', aiResponse.substring(0, 200) + '...');
      
      const parsed = this.parseAIAnalysis(aiResponse);
      console.log('Parsed result:', parsed ? 'Success' : 'Failed');
      return parsed;
    } catch (error) {
      console.log('Gemini API error:', error.response?.data || error.message);
      throw error;
    }
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
    
    // Apply realistic scoring - only major blockers get very low scores
    if (blockingIssues.length > 0) {
      // Major experience gaps (only for senior roles requiring 5+ years)
      if (blockingIssues.includes('EXPERIENCE_INSUFFICIENT')) {
        if (experienceText.includes('zero experience') || experienceText.includes('no relevant experience')) {
          finalScore = Math.min(finalScore, 25); // Major blocker
          verdict = 'COMPLETELY_UNQUALIFIED';
        } else {
          finalScore = Math.min(finalScore, 55); // Minor experience gap
          verdict = 'UNDERQUALIFIED';
        }
      }
      
      // Education requirements (only if absolutely required)
      if (blockingIssues.includes('EDUCATION_INSUFFICIENT')) {
        if (educationText.includes('required degree') && educationText.includes('none')) {
          finalScore = Math.min(finalScore, 35); // Major blocker
          verdict = 'UNDERQUALIFIED';
        }
      }
      
      // Seniority mismatch (only for major gaps like junior->senior)
      if (blockingIssues.includes('SENIORITY_MISMATCH')) {
        if (seniorityText.includes('junior') && seniorityText.includes('senior')) {
          finalScore = Math.min(finalScore, 45); // Significant gap
          verdict = 'UNDERQUALIFIED';
        }
      }
      
      // Multiple major issues
      if (blockingIssues.length >= 2 && finalScore < 30) {
        finalScore = Math.min(finalScore, 20);
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
      seniorityMismatch: parsed.seniorityMismatch,
      aiSummary: parsed.summary
    });
    
    return {
      matchScore: finalScore,
      skillsMatch,
      skillsGap,
      experienceGap: parsed.experienceGap || 'No experience analysis available',
      educationGap: parsed.educationGap || 'No education analysis available', 
      seniorityMismatch: parsed.seniorityMismatch || 'No seniority analysis available',
      recommendations: parsed.recommendations && parsed.recommendations.length > 0 ? 
        parsed.recommendations : this.generateIntelligentRecommendations(blockingIssues, skillsGap, finalScore),
      summary: parsed.summary || breakdown.summary,
      verdict,
      blockingIssues,
      breakdown,
      strengths: skillsMatch.slice(0, 5),
      improvements: skillsGap.slice(0, 5)
    };
  }

  generateIntelligentBreakdown({skillsMatch, skillsGap, blockingIssues, originalScore, finalScore, experienceGap, educationGap, seniorityMismatch, aiSummary}) {
    const breakdown = {
      eligibilityScore: 0,
      skillScore: 0,
      overallScore: finalScore,
      primaryConcerns: [],
      summary: ''
    };
    
    // Calculate realistic eligibility score
    let eligibilityScore = 75; // Start with decent eligibility
    
    // Only major blockers significantly reduce eligibility
    if (blockingIssues.includes('EXPERIENCE_INSUFFICIENT')) {
      if (experienceGap && experienceGap.toLowerCase().includes('zero experience')) {
        eligibilityScore = Math.min(eligibilityScore, 25); // Major blocker
      } else {
        eligibilityScore = Math.min(eligibilityScore, 55); // Minor gap
      }
    }
    
    if (blockingIssues.includes('EDUCATION_INSUFFICIENT')) {
      eligibilityScore = Math.min(eligibilityScore, 50); // Moderate impact
    }
    
    if (blockingIssues.includes('SENIORITY_MISMATCH')) {
      eligibilityScore = Math.min(eligibilityScore, 60); // Minor impact
    }
    
    breakdown.eligibilityScore = eligibilityScore;
    
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
    
    // Use AI's actual summary if available, otherwise generate based on analysis
    breakdown.summary = aiSummary || (
      blockingIssues.length === 0 ? 
        `✅ Meets basic eligibility. Skills: ${breakdown.skillScore}%. Qualified candidate.` :
      blockingIssues.length === 1 ? 
        `❌ ${breakdown.primaryConcerns[0]}. DO NOT APPLY to this role.` :
        `❌ COMPLETELY UNQUALIFIED: ${breakdown.primaryConcerns.join(', ').toLowerCase()}. Immediate rejection.`
    );
    
    return breakdown;
  }

  generateIntelligentRecommendations(blockingIssues, skillsGap, finalScore) {
    const recommendations = [];
    
    // Realistic recommendations based on score
    if (finalScore >= 70) {
      recommendations.push('✅ Strong candidate - prepare for interviews and highlight matching skills');
      if (skillsGap.length > 0) {
        recommendations.push(`📚 Consider learning ${skillsGap.slice(0, 2).join(', ')} to become even stronger`);
      }
    } else if (finalScore >= 50) {
      recommendations.push('📊 Good potential - address key gaps to improve your chances');
      if (blockingIssues.includes('EXPERIENCE_INSUFFICIENT')) {
        recommendations.push('💼 Highlight relevant projects and transferable experience');
      }
      if (skillsGap.length > 0) {
        recommendations.push(`📚 Focus on learning ${skillsGap.slice(0, 2).join(', ')} before applying`);
      }
    } else if (finalScore >= 30) {
      recommendations.push('⚠️ Significant gaps - consider similar but more junior roles');
      if (blockingIssues.includes('EXPERIENCE_INSUFFICIENT')) {
        recommendations.push('💼 Gain 1-2 years more experience in related roles first');
      }
      if (blockingIssues.includes('SENIORITY_MISMATCH')) {
        recommendations.push('📈 Look for mid-level positions that match your experience');
      }
    } else {
      recommendations.push('❌ Major gaps - focus on building core qualifications first');
      recommendations.push('📚 Build foundational skills and gain relevant experience');
    }
    
    return recommendations;
  }

  // Fallback analysis if all AI providers fail
  async getFallbackAnalysis(resumeText, jobDescription) {
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

    const atsAnalysis = await atsService.checkATSCompatibility(resumeText, jobDescription);

    return {
      analysis,
      aiReport: 'AI analysis temporarily unavailable. Using basic skill matching.',
      fallbackReport: this.generateFallbackReport(analysis),
      aiProvider: 'Fallback Algorithm',
      atsAnalysis
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