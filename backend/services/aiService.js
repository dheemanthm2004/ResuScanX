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

    // Use only Gemini for detailed reports (most reliable)
    console.log('Generating detailed report with Gemini...');
    try {
      const aiReport = await this.tryDetailedGemini(detailedPrompt);
      if (aiReport) {
        console.log('Gemini detailed report successful!');
        return {
          aiReport,
          fallbackReport: this.generateFallbackReport(analysis),
          aiProvider: 'Gemini AI Analysis'
        };
      }
    } catch (error) {
      console.log('Gemini detailed report failed:', error.message);
    }
    
    // Only try OpenRouter as backup for detailed reports
    try {
      console.log('Trying OpenRouter for detailed report...');
      const aiReport = await this.tryDetailedOpenRouter(detailedPrompt);
      if (aiReport) {
        console.log('OpenRouter detailed report successful!');
        return {
          aiReport,
          fallbackReport: this.generateFallbackReport(analysis),
          aiProvider: 'OpenRouter AI Analysis'
        };
      }
    } catch (error) {
      console.log('OpenRouter detailed report failed:', error.message);
    }

    // All AI providers failed
    console.log('All AI providers failed for detailed report');
    return {
      aiReport: '🤖 AI analysis temporarily unavailable - all providers failed',
      fallbackReport: this.generateFallbackReport(analysis),
      aiProvider: 'Intelligent Fallback'
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
    
    // Store resume and JD for use in parsing
    this.currentResumeText = resumeText;
    this.currentJobDescription = jobDescription;
    const prompt = `You are an experienced technical recruiter with deep understanding of hiring nuances. Analyze this resume intelligently.

RESUME:
${resumeText.substring(0, 3000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 2000)}

INTELLIGENT ANALYSIS FRAMEWORK:

1. ROLE LEVEL DETECTION:
   - Intern/Entry: Personal projects count heavily, lower experience bar
   - Junior (0-2 years): Focus on core skills, learning ability
   - Mid (2-5 years): Balance of skills + experience
   - Senior (5+ years): Leadership, architecture, mentoring

2. SKILL PRIORITY PARSING:
   - MUST-HAVE: "required", "essential", "must have"
   - PREFERRED: "preferred", "desired", "nice to have"
   - BONUS: "bonus", "plus", "additional"
   - Weight: Must-have (100%), Preferred (60%), Bonus (20%)

3. SKILL RELATIONSHIPS:
   - React ↔ Next.js, Vue (related frontend)
   - Node.js ↔ Express, NestJS (related backend)
   - SQL ↔ PostgreSQL, MySQL (related databases)
   - Give 70% credit for related skills

4. PROJECT DEPTH ANALYSIS:
   - Look for: "built", "architected", "scaled", "led"
   - Scale indicators: "users", "requests", "data"
   - Architecture terms: "microservices", "distributed", "cloud"

5. SOFT SKILLS MATCHING:
   - Communication, leadership, problem-solving
   - Match resume phrases to JD requirements

6. PROBABILISTIC VERDICTS:
   - 85%+: "Strong fit - recommend interview"
   - 70-84%: "Good fit - some gaps addressable"
   - 50-69%: "Partial fit - significant ramp-up needed"
   - <50%: "Poor fit - major gaps"

Respond in JSON:
{
  "matchScore": number (realistic 40-90% range),
  "roleLevel": "intern/junior/mid/senior",
  "mustHaveSkills": {"matched": [], "missing": []},
  "preferredSkills": {"matched": [], "missing": []},
  "relatedSkills": ["skill with 70% credit"],
  "projectDepth": "assessment of technical sophistication",
  "softSkills": {"matched": [], "missing": []},
  "experienceGap": "nuanced experience assessment",
  "recommendations": ["prioritized, actionable advice"],
  "verdict": "Strong fit/Good fit/Partial fit/Poor fit",
  "summary": "recruiter-style assessment"
}`;

    // Use Gemini as primary, others as fallback only
    try {
      console.log('Using Gemini AI for analysis...');
      const result = await this.getGeminiAnalysis(prompt, resumeText, jobDescription);
      if (result) {
        console.log('Gemini analysis successful!');
        return result;
      }
    } catch (error) {
      console.log('Gemini failed:', error.message);
    }
    
    console.log('All AI providers failed');
    return null; // All AI providers failed
  }

  async getGeminiAnalysis(prompt, resumeText, jobDescription) {
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
      
      const parsed = this.processAIResponse(aiResponse, resumeText, jobDescription);
      console.log('Parsed result:', parsed ? 'Success' : 'Failed');
      return parsed;
    } catch (error) {
      console.log('Gemini API error:', error.response?.data || error.message);
      throw error;
    }
  }

  async tryOpenRouterAnalysis(prompt, resumeText, jobDescription) {
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

  async tryMistralAnalysis(prompt, resumeText, jobDescription) {
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

  processAIResponse(response, resumeText, jobDescription) {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Apply intelligent scoring logic with resume and JD text
        const intelligentAnalysis = this.applyIntelligentScoring(parsed, resumeText, jobDescription);
        
        return intelligentAnalysis;
      }
    } catch (error) {
      console.log('Failed to parse AI response:', error.message);
    }
    
    return null;
  }



  // Apply intelligent scoring with nuanced recruiting logic
  applyIntelligentScoring(parsed, resumeText, jobDescription) {
    if (!resumeText || !jobDescription) {
      console.log('Missing resumeText or jobDescription in applyIntelligentScoring');
      return null;
    }

    // Extract skills from new structure
    const mustHaveMatched = parsed.mustHaveSkills?.matched || [];
    const mustHaveMissing = parsed.mustHaveSkills?.missing || [];
    const preferredMatched = parsed.preferredSkills?.matched || [];
    const preferredMissing = parsed.preferredSkills?.missing || [];
    const relatedSkills = parsed.relatedSkills || [];
    const softSkillsMatched = parsed.softSkills?.matched || [];
    const softSkillsMissing = parsed.softSkills?.missing || [];
    
    // Combine all matched skills for display
    const allSkillsMatch = [...mustHaveMatched, ...preferredMatched, ...relatedSkills, ...softSkillsMatched];
    const allSkillsGap = [...mustHaveMissing, ...preferredMissing, ...softSkillsMissing];
    
    let finalScore = Math.min(Math.max(parsed.matchScore || 50, 20), 95);
    let verdict = parsed.verdict || 'Partial fit';
    
    // Role-level adjustments
    const roleLevel = parsed.roleLevel || 'junior';
    const resumeLower = resumeText.toLowerCase();
    const jdLower = jobDescription.toLowerCase();
    
    // Intelligent experience validation based on role level
    let experienceIssues = [];
    if (roleLevel === 'senior' && resumeLower.includes('student')) {
      experienceIssues.push('Student applying for senior role');
      finalScore = Math.min(finalScore, 25);
    } else if (roleLevel === 'mid' && !resumeLower.match(/\d+\s*(?:years?|yrs?)/)) {
      experienceIssues.push('No clear experience for mid-level role');
      finalScore = Math.min(finalScore, 45);
    }
    
    // Must-have skills are critical
    if (mustHaveMissing.length > 0) {
      const penalty = Math.min(mustHaveMissing.length * 15, 40);
      finalScore = Math.max(finalScore - penalty, 20);
    }
    
    // Preferred skills have moderate impact
    if (preferredMissing.length > 0) {
      const penalty = Math.min(preferredMissing.length * 8, 25);
      finalScore = Math.max(finalScore - penalty, 30);
    }
    
    // Related skills provide partial credit
    if (relatedSkills.length > 0) {
      finalScore = Math.min(finalScore + (relatedSkills.length * 5), 95);
    }
    
    // Normalize verdict based on final score
    if (finalScore >= 85) {
      verdict = 'Strong fit';
    } else if (finalScore >= 70) {
      verdict = 'Good fit';
    } else if (finalScore >= 50) {
      verdict = 'Partial fit';
    } else {
      verdict = 'Poor fit';
    }
    
    // Generate intelligent breakdown
    const breakdown = this.generateNuancedBreakdown({
      finalScore,
      roleLevel,
      mustHaveMatched,
      mustHaveMissing,
      preferredMatched,
      preferredMissing,
      relatedSkills,
      projectDepth: parsed.projectDepth,
      experienceIssues,
      summary: parsed.summary
    });
    
    return {
      matchScore: finalScore,
      skillsMatch: allSkillsMatch,
      skillsGap: allSkillsGap,
      experienceGap: parsed.experienceGap || 'Experience assessment completed',
      educationGap: 'Education requirements assessed',
      seniorityMismatch: `Role level: ${roleLevel}`,
      recommendations: parsed.recommendations || this.generateSmartRecommendations(finalScore, mustHaveMissing, preferredMissing),
      summary: parsed.summary || breakdown.summary,
      verdict,
      roleLevel,
      mustHaveSkills: { matched: mustHaveMatched, missing: mustHaveMissing },
      preferredSkills: { matched: preferredMatched, missing: preferredMissing },
      relatedSkills,
      projectDepth: parsed.projectDepth,
      breakdown,
      strengths: allSkillsMatch.slice(0, 6),
      improvements: allSkillsGap.slice(0, 6)
    };
  }

  generateNuancedBreakdown({finalScore, roleLevel, mustHaveMatched, mustHaveMissing, preferredMatched, preferredMissing, relatedSkills, projectDepth, experienceIssues, summary}) {
    const breakdown = {
      eligibilityScore: Math.max(finalScore - 10, 30),
      skillScore: 0,
      overallScore: finalScore,
      primaryStrengths: [],
      primaryConcerns: [],
      summary: ''
    };
    
    // Calculate nuanced skill score
    const totalCriticalSkills = mustHaveMatched.length + mustHaveMissing.length;
    const criticalSkillScore = totalCriticalSkills > 0 ? 
      Math.round((mustHaveMatched.length / totalCriticalSkills) * 100) : 70;
    
    const totalPreferredSkills = preferredMatched.length + preferredMissing.length;
    const preferredSkillScore = totalPreferredSkills > 0 ? 
      Math.round((preferredMatched.length / totalPreferredSkills) * 100) : 50;
    
    breakdown.skillScore = Math.round((criticalSkillScore * 0.7) + (preferredSkillScore * 0.3));
    
    // Identify strengths
    if (mustHaveMatched.length > 0) {
      breakdown.primaryStrengths.push(`Strong in core skills: ${mustHaveMatched.slice(0, 3).join(', ')}`);
    }
    if (relatedSkills.length > 0) {
      breakdown.primaryStrengths.push(`Transferable skills: ${relatedSkills.slice(0, 2).join(', ')}`);
    }
    if (projectDepth && projectDepth.includes('sophisticated')) {
      breakdown.primaryStrengths.push('Demonstrates technical depth in projects');
    }
    
    // Identify concerns
    if (mustHaveMissing.length > 0) {
      breakdown.primaryConcerns.push(`Missing critical skills: ${mustHaveMissing.slice(0, 2).join(', ')}`);
    }
    if (experienceIssues.length > 0) {
      breakdown.primaryConcerns.push(experienceIssues[0]);
    }
    if (preferredMissing.length > 2) {
      breakdown.primaryConcerns.push('Limited coverage of preferred skills');
    }
    
    // Generate intelligent summary
    breakdown.summary = summary || this.generateRecruitingSummary(finalScore, roleLevel, breakdown.primaryStrengths, breakdown.primaryConcerns);
    
    return breakdown;
  }
  
  generateRecruitingSummary(score, roleLevel, strengths, concerns) {
    if (score >= 85) {
      return `✅ Strong ${roleLevel}-level candidate. ${strengths.length > 0 ? strengths[0] : 'Well-qualified'}. Recommend interview.`;
    } else if (score >= 70) {
      return `🟡 Good ${roleLevel}-level fit. ${concerns.length > 0 ? concerns[0] + ' but addressable.' : 'Minor gaps addressable.'}`;
    } else if (score >= 50) {
      return `🟠 Partial fit for ${roleLevel} role. ${concerns.length > 0 ? concerns[0] : 'Significant ramp-up needed'}.`;
    } else {
      return `🔴 Poor fit for ${roleLevel} position. ${concerns.length > 0 ? concerns[0] : 'Major skill gaps'}. Not recommended.`;
    }
  }

  generateSmartRecommendations(finalScore, mustHaveMissing, preferredMissing) {
    const recommendations = [];
    
    if (finalScore >= 85) {
      recommendations.push('✅ Strong candidate - apply with confidence');
      recommendations.push('💬 Prepare to discuss your matching experience in detail');
      if (preferredMissing.length > 0) {
        recommendations.push(`📚 Optional: Learn ${preferredMissing[0]} to stand out further`);
      }
    } else if (finalScore >= 70) {
      recommendations.push('🟡 Good fit - apply and address gaps in cover letter');
      if (mustHaveMissing.length > 0) {
        recommendations.push(`🎯 Priority: Gain experience with ${mustHaveMissing[0]}`);
      }
      recommendations.push('💬 Emphasize your learning ability and related experience');
    } else if (finalScore >= 50) {
      recommendations.push('🟠 Partial fit - consider applying if you can address key gaps');
      if (mustHaveMissing.length > 0) {
        recommendations.push(`⚡ Critical: Learn ${mustHaveMissing.slice(0, 2).join(' and ')} first`);
      }
      recommendations.push('📈 Look for similar roles with lower requirements');
    } else {
      recommendations.push('🔴 Poor fit - focus on building core skills first');
      if (mustHaveMissing.length > 0) {
        recommendations.push(`🎯 Build foundation: ${mustHaveMissing.slice(0, 2).join(', ')}`);
      }
      recommendations.push('📚 Consider junior roles to gain experience');
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