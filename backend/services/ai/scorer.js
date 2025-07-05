class RealisticScorer {
  applyScoring(parsed, resumeText, jobDescription, providerName) {
    if (!resumeText || !jobDescription) return null;

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
    
    // Apply realistic penalties
    finalScore = this.applyExperiencePenalties(finalScore, experienceData);
    finalScore = this.applyCriticalSkillsPenalties(finalScore, mustHaveMissing);
    finalScore = this.applyRedFlagPenalties(finalScore, redFlags, roleLevel);
    finalScore = this.applyBonuses(finalScore, parsed.projectComplexity, relatedSkills);
    
    const verdict = this.determineVerdict(finalScore);
    const breakdown = this.generateBreakdown({
      finalScore, roleLevel, mustHaveMatched, mustHaveMissing,
      preferredMatched, preferredMissing, relatedSkills,
      experienceData, redFlags, strengths,
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
      recommendations: parsed.recommendations || this.generateRecommendations(finalScore, mustHaveMissing, experienceData, redFlags),
      summary: parsed.recruiterNotes || breakdown.summary,
      verdict, roleLevel, mustHaveSkills: { matched: mustHaveMatched, missing: mustHaveMissing },
      preferredSkills: { matched: preferredMatched, missing: preferredMissing },
      relatedSkills, experienceData, redFlags,
      projectComplexity: parsed.projectComplexity, breakdown,
      strengths: allSkillsMatch.slice(0, 6),
      improvements: allSkillsGap.slice(0, 6),
      aiProvider: providerName
    };
  }

  applyExperiencePenalties(score, experienceData) {
    if (experienceData.gap > 0) {
      if (experienceData.gap >= 3) {
        return Math.min(score, 35);
      } else if (experienceData.gap >= 1) {
        return Math.max(score - (experienceData.gap * 12), 25);
      }
    }
    return score;
  }

  applyCriticalSkillsPenalties(score, mustHaveMissing) {
    if (mustHaveMissing.length > 0) {
      const penalty = mustHaveMissing.length * 18;
      return Math.max(score - penalty, 20);
    }
    return score;
  }

  applyRedFlagPenalties(score, redFlags, roleLevel) {
    redFlags.forEach(flag => {
      if (flag.includes('student') && roleLevel === 'senior') {
        score = Math.min(score, 25);
      } else if (flag.includes('overqualified')) {
        score = Math.min(score, 60);
      } else if (flag.includes('no experience')) {
        score = Math.min(score, 40);
      }
    });
    return score;
  }

  applyBonuses(score, projectComplexity, relatedSkills) {
    if (projectComplexity === 'advanced') {
      score = Math.min(score + 8, 95);
    } else if (projectComplexity === 'intermediate') {
      score = Math.min(score + 4, 90);
    }
    
    if (relatedSkills.length > 0) {
      score = Math.min(score + (relatedSkills.length * 3), 90);
    }
    
    return score;
  }

  determineVerdict(score) {
    if (score >= 85) return 'Strong fit';
    if (score >= 70) return 'Good fit';
    if (score >= 50) return 'Partial fit';
    if (score >= 30) return 'Poor fit';
    return 'Not suitable';
  }

  generateBreakdown(data) {
    const { finalScore, roleLevel, mustHaveMatched, mustHaveMissing, 
            experienceData, redFlags, strengths, recruiterNotes } = data;
    
    const breakdown = {
      eligibilityScore: Math.max(finalScore - 5, 20),
      skillScore: this.calculateSkillScore(mustHaveMatched, mustHaveMissing),
      experienceScore: this.calculateExperienceScore(experienceData),
      overallScore: finalScore,
      primaryStrengths: this.identifyStrengths(data),
      primaryConcerns: this.identifyConcerns(data),
      hiringRecommendation: this.getHiringRecommendation(finalScore),
      summary: recruiterNotes || this.generateSummary(finalScore, roleLevel, data)
    };
    
    return breakdown;
  }

  calculateSkillScore(matched, missing) {
    const total = matched.length + missing.length;
    return total > 0 ? Math.round((matched.length / total) * 100) : 60;
  }

  calculateExperienceScore(experienceData) {
    if (experienceData.gap <= 0) return 90;
    if (experienceData.gap === 1) return 70;
    if (experienceData.gap === 2) return 50;
    return 25;
  }

  identifyStrengths(data) {
    const strengths = [];
    if (data.mustHaveMatched.length >= 3) {
      strengths.push(`Solid technical foundation: ${data.mustHaveMatched.slice(0, 3).join(', ')}`);
    }
    if (data.relatedSkills.length > 0) {
      strengths.push(`Transferable experience: ${data.relatedSkills.slice(0, 2).join(', ')}`);
    }
    if (data.projectComplexity === 'advanced') {
      strengths.push('Demonstrates advanced project experience');
    }
    return strengths;
  }

  identifyConcerns(data) {
    const concerns = [];
    if (data.mustHaveMissing.length > 0) {
      concerns.push(`Missing critical requirements: ${data.mustHaveMissing.slice(0, 2).join(', ')}`);
    }
    if (data.experienceData.gap > 2) {
      concerns.push(`Significant experience gap: ${data.experienceData.gap} years short`);
    }
    if (data.redFlags.length > 0) {
      concerns.push(data.redFlags[0]);
    }
    return concerns;
  }

  getHiringRecommendation(score) {
    if (score >= 80) return '✅ RECOMMEND - Strong candidate, proceed to interview';
    if (score >= 65) return '🟡 CONSIDER - Good potential, address gaps in interview';
    if (score >= 45) return '🟠 MAYBE - Significant gaps, consider for junior role';
    return '❌ REJECT - Poor fit, major skill/experience gaps';
  }

  generateSummary(score, roleLevel, data) {
    const { primaryStrengths, primaryConcerns } = this.identifyStrengths(data), this.identifyConcerns(data);
    
    if (score >= 85) {
      return `STRONG CANDIDATE: Excellent ${roleLevel}-level fit. ${primaryStrengths[0] || 'Meets all key requirements'}. High confidence hire.`;
    } else if (score >= 70) {
      return `GOOD CANDIDATE: Solid ${roleLevel}-level potential. ${primaryStrengths[0] || 'Strong foundation'}. ${primaryConcerns[0] ? primaryConcerns[0] + ' - addressable.' : 'Minor gaps manageable.'}`;
    } else if (score >= 50) {
      return `MARGINAL FIT: Limited match for ${roleLevel} role. ${primaryConcerns[0] || 'Multiple skill gaps'}. Consider junior position.`;
    } else if (score >= 30) {
      return `POOR FIT: Significant gaps for ${roleLevel} position. ${primaryConcerns[0] || 'Major skill deficiencies'}. Not recommended.`;
    } else {
      return `NOT SUITABLE: Fundamental mismatch for ${roleLevel} role. ${primaryConcerns[0] || 'Critical requirements missing'}. Do not proceed.`;
    }
  }

  generateRecommendations(finalScore, mustHaveMissing, experienceData, redFlags) {
    const recommendations = [];
    
    if (finalScore >= 80) {
      recommendations.push('🎯 STRONG MATCH - Apply immediately with confidence');
      recommendations.push('📝 Highlight your matching skills prominently in application');
      if (mustHaveMissing.length > 0) {
        recommendations.push(`📚 Bonus: Quick refresh on ${mustHaveMissing[0]} before interview`);
      }
    } else if (finalScore >= 65) {
      recommendations.push('✅ GOOD FIT - Apply and address gaps proactively');
      if (mustHaveMissing.length > 0) {
        recommendations.push(`🎯 PRIORITY: Start learning ${mustHaveMissing[0]} immediately`);
      }
    } else if (finalScore >= 45) {
      recommendations.push('⚠️ RISKY APPLICATION - Major gaps need addressing');
      if (experienceData.gap > 1) {
        recommendations.push(`⏰ Gain ${experienceData.gap} more years experience first`);
      }
    } else {
      recommendations.push('❌ NOT READY - Significant skill building required');
      if (mustHaveMissing.length > 0) {
        recommendations.push(`📚 Build foundation: ${mustHaveMissing.slice(0, 3).join(', ')}`);
      }
    }
    
    return recommendations;
  }
}

module.exports = RealisticScorer;