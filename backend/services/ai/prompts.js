class AIPrompts {
  static getAnalysisPrompt(resumeText, jobDescription) {
    return `You are an experienced technical recruiter analyzing candidates for real hiring decisions. Be realistic and thorough.

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
  }

  static getDetailedReportPrompt(resumeText, jobDescription, analysis) {
    return `HIRING MANAGER REPORT - COMPREHENSIVE CANDIDATE ASSESSMENT

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
  }
}

module.exports = AIPrompts;