const axios = require('axios');
const natural = require('natural');
const atsService = require('./atsService');

class AIService {
  constructor() {
    // AI API Keys with priority order: Gemini (2) → Mistral → Cohere → OpenRouter
    this.aiProviders = [
      { name: 'Gemini-1', key: process.env.GEMINI_API_KEY, type: 'gemini' },
      { name: 'Gemini-2', key: process.env.GEMINI_API_KEY_new, type: 'gemini' },
      { name: 'Mistral', key: process.env.MISTRAL_API_KEY, type: 'mistral' },
      { name: 'Cohere', key: process.env.COHERE_API_KEY, type: 'cohere' },
      { name: 'OpenRouter', key: process.env.OPEN_ROUTER_API_KEY, type: 'openrouter' }
    ];
    this.currentProviderIndex = 0;
  }

  // Get next available AI provider
  getNextProvider() {
    if (this.currentProviderIndex >= this.aiProviders.length) {
      return null; // All providers exhausted
    }
    return this.aiProviders[this.currentProviderIndex++];
  }

  // Reset provider rotation
  resetProviders() {
    this.currentProviderIndex = 0;
  }

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

  // Generate detailed AI reports with provider rotation
  async generateAIReport(resumeText, jobDescription, analysis) {
    const detailedPrompt = `HIRING MANAGER REPORT - COMPREHENSIVE CANDIDATE ASSESSMENT

CANDIDATE RESUME:
${resumeText.substring(0, 4000)}

POSITION REQUIREMENTS:
${jobDescription.substring(0, 2500)}

INITIAL SCREENING RESULTS:
- Match Score: ${analysis.matchScore}%
- Role Level: ${analysis.roleLevel}
- Critical Skills: ${analysis.mustHaveSkills?.matched?.join(', ') || 'None'}
- Missing Skills: ${analysis.mustHaveSkills?.missing?.join(', ') || 'None'}
- Experience Gap: ${analysis.experienceData?.gap || 0} years
- Verdict: ${analysis.verdict}

Provide a DETAILED HIRING ASSESSMENT (1200+ words) covering:

1. EXECUTIVE SUMMARY (150 words):
   - Overall hiring recommendation
   - Key strengths and concerns
   - Risk assessment for this hire

2. TECHNICAL COMPETENCY ANALYSIS (300 words):
   - Detailed skill-by-skill evaluation
   - Proficiency level assessment
   - Technology stack alignment
   - Learning curve estimation

3. EXPERIENCE & CAREER PROGRESSION (250 words):
   - Work history relevance
   - Career trajectory analysis
   - Leadership/mentoring evidence
   - Industry experience fit

4. ROLE READINESS ASSESSMENT (200 words):
   - Day-1 productivity potential
   - Onboarding time estimate
   - Team integration likelihood
   - Growth potential in role

5. RISK FACTORS & MITIGATION (200 words):
   - Potential hiring risks
   - Skill gap mitigation strategies
   - Success probability
   - Alternative role considerations

6. FINAL HIRING DECISION (100 words):
   - Clear HIRE/NO HIRE/MAYBE recommendation
   - Salary band suggestion
   - Interview focus areas
   - Next steps

Be brutally honest like a real hiring manager. Reference specific resume content.`;

    this.resetProviders();
    
    // Try all providers for detailed reports
    while (this.currentProviderIndex < this.aiProviders.length) {
      const provider = this.getNextProvider();
      if (!provider || !provider.key) continue;
      
      try {
        console.log(`Generating detailed report with ${provider.name}...`);
        let aiReport = null;
        
        switch (provider.type) {
          case 'gemini':
            aiReport = await this.callGeminiAPI(detailedPrompt, provider.key);
            break;
          case 'mistral':
            aiReport = await this.callMistralAPI(detailedPrompt, provider.key);
            break;
          case 'cohere':
            aiReport = await this.callCohereAPI(detailedPrompt, provider.key);
            break;
          case 'openrouter':
            aiReport = await this.callOpenRouterAPI(detailedPrompt, provider.key);
            break;
        }
        
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
    this.resetProviders();
    
    // Try providers in order for chat
    while (this.currentProviderIndex < this.aiProviders.length) {
      const provider = this.getNextProvider();
      if (!provider || !provider.key) continue;
      
      try {
        let response = null;
        
        switch (provider.type) {
          case 'gemini':
            response = await this.callGeminiAPI(context, provider.key);
            break;
          case 'mistral':
            response = await this.callMistralAPI(context, provider.key);
            break;
          case 'cohere':
            response = await this.callCohereAPI(context, provider.key);
            break;
          case 'openrouter':
            response = await this.callOpenRouterAPI(context, provider.key);
            break;
        }
        
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

  // AI-powered comprehensive analysis using multiple providers with rotation
  async getComprehensiveAIAnalysis(resumeText, jobDescription) {
    console.log('Starting AI analysis with provider rotation...');
    this.resetProviders();
    
    const prompt = `You are an experienced technical recruiter analyzing candidates for real hiring decisions. Be realistic and thorough.

RESUME:
${resumeText.substring(0, 3500)}

JOB DESCRIPTION:
${jobDescription.substring(0, 2500)}

RECRUITER ANALYSIS FRAMEWORK:

1. ROLE LEVEL ASSESSMENT:
   - Entry/Intern: 0-1 years, focus on potential and projects
   - Junior: 1-3 years, core skills + learning ability
   - Mid: 3-6 years, proven experience + technical depth
   - Senior: 6+ years, leadership + architecture + mentoring

2. SKILL CATEGORIZATION (from JD):
   - CRITICAL: "required", "must have", "essential" (100% weight)
   - IMPORTANT: "preferred", "desired", "should have" (70% weight)
   - NICE-TO-HAVE: "bonus", "plus", "additional" (30% weight)

3. SKILL RELATIONSHIPS & TRANSFERABILITY:
   - React ↔ Vue, Angular (70% credit)
   - Node.js ↔ Express, Fastify (80% credit)
   - AWS ↔ Azure, GCP (60% credit)
   - SQL ↔ PostgreSQL, MySQL (90% credit)

4. EXPERIENCE VALIDATION:
   - Years mentioned vs role requirements
   - Project complexity and scale
   - Leadership/mentoring evidence
   - Industry relevance

5. RED FLAGS:
   - Student applying for senior roles
   - No relevant experience for mid+ roles
   - Missing ALL critical skills
   - Overqualified (senior applying for junior)

6. REALISTIC SCORING:
   - 90-95%: Perfect fit (rare)
   - 80-89%: Strong candidate
   - 65-79%: Good fit with minor gaps
   - 45-64%: Partial fit, needs development
   - 20-44%: Poor fit, major gaps
   - <20%: Not suitable

Respond ONLY in valid JSON:
{
  "matchScore": number,
  "roleLevel": "entry/junior/mid/senior",
  "mustHaveSkills": {"matched": [], "missing": []},
  "preferredSkills": {"matched": [], "missing": []},
  "relatedSkills": [],
  "experienceYears": {"candidate": number, "required": number, "gap": number},
  "projectComplexity": "basic/intermediate/advanced",
  "redFlags": [],
  "strengths": [],
  "recommendations": [],
  "verdict": "Strong fit/Good fit/Partial fit/Poor fit/Not suitable",
  "recruiterNotes": "honest assessment for hiring manager"
}`;

    // Try all providers in priority order
    while (this.currentProviderIndex < this.aiProviders.length) {
      const provider = this.getNextProvider();
      if (!provider || !provider.key) continue;
      
      try {
        console.log(`Trying ${provider.name}...`);
        let result = null;
        
        switch (provider.type) {
          case 'gemini':
            result = await this.callGeminiAPI(prompt, provider.key);
            break;
          case 'mistral':
            result = await this.callMistralAPI(prompt, provider.key);
            break;
          case 'cohere':
            result = await this.callCohereAPI(prompt, provider.key);
            break;
          case 'openrouter':
            result = await this.callOpenRouterAPI(prompt, provider.key);
            break;
        }
        
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

  // Individual API callers
  async callGeminiAPI(prompt, apiKey) {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { 'Content-Type': 'application/json' }, timeout: 20000 }
    );
    return response.data.candidates[0].content.parts[0].text;
  }

  async callMistralAPI(prompt, apiKey) {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-tiny',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.3
      },
      {
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        timeout: 20000
      }
    );
    return response.data.choices[0].message.content;
  }

  async callCohereAPI(prompt, apiKey) {
    const response = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: 'command-light',
        prompt: prompt,
        max_tokens: 800,
        temperature: 0.3
      },
      {
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        timeout: 20000
      }
    );
    return response.data.generations[0].text;
  }

  async callOpenRouterAPI(prompt, apiKey) {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.3
      },
      {
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        timeout: 20000
      }
    );
    return response.data.choices[0].message.content;
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

  processAIResponse(response, resumeText, jobDescription, providerName) {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Apply realistic recruiter scoring
        const realisticAnalysis = this.applyRealisticScoring(parsed, resumeText, jobDescription, providerName);
        
        return realisticAnalysis;
      }
    } catch (error) {
      console.log(`Failed to parse ${providerName} response:`, error.message);
    }
    
    return null;
  }



  // Apply realistic recruiter scoring logic
  applyRealisticScoring(parsed, resumeText, jobDescription, providerName) {
    if (!resumeText || !jobDescription) {
      console.log('Missing resumeText or jobDescription');
      return null;
    }

    const mustHaveMatched = parsed.mustHaveSkills?.matched || [];
    const mustHaveMissing = parsed.mustHaveSkills?.missing || [];
    const preferredMatched = parsed.preferredSkills?.matched || [];
    const preferredMissing = parsed.preferredSkills?.missing || [];
    const relatedSkills = parsed.relatedSkills || [];
    const redFlags = parsed.redFlags || [];
    const strengths = parsed.strengths || [];
    
    const allSkillsMatch = [...mustHaveMatched, ...preferredMatched, ...relatedSkills];
    const allSkillsGap = [...mustHaveMissing, ...preferredMissing];
    
    let finalScore = Math.min(Math.max(parsed.matchScore || 50, 15), 95);
    const roleLevel = parsed.roleLevel || 'junior';
    const experienceData = parsed.experienceYears || { candidate: 0, required: 0, gap: 0 };
    
    // REALISTIC RECRUITER ADJUSTMENTS
    
    // 1. Experience Gap Penalties (Harsh but realistic)
    if (experienceData.gap > 0) {
      if (experienceData.gap >= 3) {
        finalScore = Math.min(finalScore, 35); // Significant experience gap
      } else if (experienceData.gap >= 1) {
        finalScore = Math.max(finalScore - (experienceData.gap * 12), 25);
      }
    }
    
    // 2. Critical Skills Missing (Deal breakers)
    if (mustHaveMissing.length > 0) {
      const criticalPenalty = mustHaveMissing.length * 18;
      finalScore = Math.max(finalScore - criticalPenalty, 20);
    }
    
    // 3. Red Flags (Automatic score caps)
    redFlags.forEach(flag => {
      if (flag.includes('student') && roleLevel === 'senior') {
        finalScore = Math.min(finalScore, 25);
      } else if (flag.includes('overqualified')) {
        finalScore = Math.min(finalScore, 60);
      } else if (flag.includes('no experience')) {
        finalScore = Math.min(finalScore, 40);
      }
    });
    
    // 4. Project Complexity Bonus
    if (parsed.projectComplexity === 'advanced') {
      finalScore = Math.min(finalScore + 8, 95);
    } else if (parsed.projectComplexity === 'intermediate') {
      finalScore = Math.min(finalScore + 4, 90);
    }
    
    // 5. Related Skills Partial Credit
    if (relatedSkills.length > 0) {
      finalScore = Math.min(finalScore + (relatedSkills.length * 3), 90);
    }
    
    // 6. Realistic Verdict Assignment
    let verdict = 'Poor fit';
    if (finalScore >= 85) {
      verdict = 'Strong fit';
    } else if (finalScore >= 70) {
      verdict = 'Good fit';
    } else if (finalScore >= 50) {
      verdict = 'Partial fit';
    } else if (finalScore >= 30) {
      verdict = 'Poor fit';
    } else {
      verdict = 'Not suitable';
    }
    
    // Generate recruiter-style breakdown
    const breakdown = this.generateRecruiterBreakdown({
      finalScore,
      roleLevel,
      mustHaveMatched,
      mustHaveMissing,
      preferredMatched,
      preferredMissing,
      relatedSkills,
      experienceData,
      redFlags,
      strengths,
      projectComplexity: parsed.projectComplexity,
      recruiterNotes: parsed.recruiterNotes
    });
    
    return {
      matchScore: Math.round(finalScore),
      skillsMatch: allSkillsMatch,
      skillsGap: allSkillsGap,
      experienceGap: `${experienceData.gap} years gap (${experienceData.candidate}/${experienceData.required} required)`,
      educationGap: 'Assessed by AI',
      seniorityMismatch: `${roleLevel} level role`,
      recommendations: parsed.recommendations || this.generateRealisticRecommendations(finalScore, mustHaveMissing, experienceData, redFlags),
      summary: parsed.recruiterNotes || breakdown.summary,
      verdict,
      roleLevel,
      mustHaveSkills: { matched: mustHaveMatched, missing: mustHaveMissing },
      preferredSkills: { matched: preferredMatched, missing: preferredMissing },
      relatedSkills,
      experienceData,
      redFlags,
      projectComplexity: parsed.projectComplexity,
      breakdown,
      strengths: allSkillsMatch.slice(0, 6),
      improvements: allSkillsGap.slice(0, 6),
      aiProvider: providerName
    };
  }

  generateRecruiterBreakdown({finalScore, roleLevel, mustHaveMatched, mustHaveMissing, preferredMatched, preferredMissing, relatedSkills, experienceData, redFlags, strengths, projectComplexity, recruiterNotes}) {
    const breakdown = {
      eligibilityScore: Math.max(finalScore - 5, 20),
      skillScore: 0,
      experienceScore: 0,
      overallScore: finalScore,
      primaryStrengths: [],
      primaryConcerns: [],
      hiringRecommendation: '',
      summary: ''
    };
    
    // Calculate realistic skill score
    const totalCritical = mustHaveMatched.length + mustHaveMissing.length;
    const criticalScore = totalCritical > 0 ? Math.round((mustHaveMatched.length / totalCritical) * 100) : 60;
    
    const totalPreferred = preferredMatched.length + preferredMissing.length;
    const preferredScore = totalPreferred > 0 ? Math.round((preferredMatched.length / totalPreferred) * 100) : 40;
    
    breakdown.skillScore = Math.round((criticalScore * 0.8) + (preferredScore * 0.2));
    
    // Calculate experience score
    if (experienceData.gap <= 0) {
      breakdown.experienceScore = 90;
    } else if (experienceData.gap === 1) {
      breakdown.experienceScore = 70;
    } else if (experienceData.gap === 2) {
      breakdown.experienceScore = 50;
    } else {
      breakdown.experienceScore = 25;
    }
    
    // Identify key strengths
    if (mustHaveMatched.length >= 3) {
      breakdown.primaryStrengths.push(`Solid technical foundation: ${mustHaveMatched.slice(0, 3).join(', ')}`);
    }
    if (relatedSkills.length > 0) {
      breakdown.primaryStrengths.push(`Transferable experience: ${relatedSkills.slice(0, 2).join(', ')}`);
    }
    if (projectComplexity === 'advanced') {
      breakdown.primaryStrengths.push('Demonstrates advanced project experience');
    }
    if (strengths.length > 0) {
      breakdown.primaryStrengths.push(strengths[0]);
    }
    
    // Identify major concerns
    if (mustHaveMissing.length > 0) {
      breakdown.primaryConcerns.push(`Missing critical requirements: ${mustHaveMissing.slice(0, 2).join(', ')}`);
    }
    if (experienceData.gap > 2) {
      breakdown.primaryConcerns.push(`Significant experience gap: ${experienceData.gap} years short`);
    }
    if (redFlags.length > 0) {
      breakdown.primaryConcerns.push(redFlags[0]);
    }
    
    // Generate hiring recommendation
    if (finalScore >= 80) {
      breakdown.hiringRecommendation = '✅ RECOMMEND - Strong candidate, proceed to interview';
    } else if (finalScore >= 65) {
      breakdown.hiringRecommendation = '🟡 CONSIDER - Good potential, address gaps in interview';
    } else if (finalScore >= 45) {
      breakdown.hiringRecommendation = '🟠 MAYBE - Significant gaps, consider for junior role';
    } else {
      breakdown.hiringRecommendation = '❌ REJECT - Poor fit, major skill/experience gaps';
    }
    
    breakdown.summary = recruiterNotes || this.generateHiringManagerSummary(finalScore, roleLevel, breakdown.primaryStrengths, breakdown.primaryConcerns);
    
    return breakdown;
  }
  
  generateHiringManagerSummary(score, roleLevel, strengths, concerns) {
    if (score >= 85) {
      return `STRONG CANDIDATE: Excellent ${roleLevel}-level fit. ${strengths.length > 0 ? strengths[0] : 'Meets all key requirements'}. High confidence hire - schedule interview immediately.`;
    } else if (score >= 70) {
      return `GOOD CANDIDATE: Solid ${roleLevel}-level potential. ${strengths.length > 0 ? strengths[0] : 'Strong foundation'}. ${concerns.length > 0 ? concerns[0] + ' - addressable through training.' : 'Minor gaps manageable.'}`;
    } else if (score >= 50) {
      return `MARGINAL FIT: Limited match for ${roleLevel} role. ${concerns.length > 0 ? concerns[0] : 'Multiple skill gaps'}. Consider for junior position or extensive onboarding.`;
    } else if (score >= 30) {
      return `POOR FIT: Significant gaps for ${roleLevel} position. ${concerns.length > 0 ? concerns[0] : 'Major skill deficiencies'}. Not recommended unless desperate.`;
    } else {
      return `NOT SUITABLE: Fundamental mismatch for ${roleLevel} role. ${concerns.length > 0 ? concerns[0] : 'Critical requirements missing'}. Do not proceed.`;
    }
  }

  generateRealisticRecommendations(finalScore, mustHaveMissing, experienceData, redFlags) {
    const recommendations = [];
    
    if (finalScore >= 80) {
      recommendations.push('🎯 STRONG MATCH - Apply immediately with confidence');
      recommendations.push('📝 Highlight your matching skills prominently in application');
      recommendations.push('💼 Prepare specific examples of relevant project experience');
      if (mustHaveMissing.length > 0) {
        recommendations.push(`📚 Bonus: Quick refresh on ${mustHaveMissing[0]} before interview`);
      }
    } else if (finalScore >= 65) {
      recommendations.push('✅ GOOD FIT - Apply and address gaps proactively');
      recommendations.push('📄 Write compelling cover letter explaining your potential');
      if (mustHaveMissing.length > 0) {
        recommendations.push(`🎯 PRIORITY: Start learning ${mustHaveMissing[0]} immediately`);
      }
      recommendations.push('🗣️ Emphasize your adaptability and quick learning ability');
    } else if (finalScore >= 45) {
      recommendations.push('⚠️ RISKY APPLICATION - Major gaps need addressing');
      if (experienceData.gap > 1) {
        recommendations.push(`⏰ Gain ${experienceData.gap} more years experience first`);
      }
      if (mustHaveMissing.length > 0) {
        recommendations.push(`🚨 CRITICAL: Master ${mustHaveMissing.slice(0, 2).join(' and ')} before applying`);
      }
      recommendations.push('📊 Look for junior/mid-level roles instead');
    } else {
      recommendations.push('❌ NOT READY - Significant skill building required');
      if (redFlags.length > 0) {
        recommendations.push(`🚩 Address: ${redFlags[0]}`);
      }
      if (mustHaveMissing.length > 0) {
        recommendations.push(`📚 Build foundation: ${mustHaveMissing.slice(0, 3).join(', ')}`);
      }
      recommendations.push('🎯 Target entry-level positions to gain experience');
      recommendations.push('💡 Consider bootcamps or certifications in missing areas');
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