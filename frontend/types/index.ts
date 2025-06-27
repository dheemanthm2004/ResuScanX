export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Analysis {
  matchScore: number;
  skillsMatch: string[];
  skillsGap: string[];
  recommendations: string[];
  summary: string;
  strengths: string[];
  improvements: string[];
}

export interface AnalysisResult {
  id: string;
  analysis: Analysis;
  aiReport: string;
  fallbackReport?: string;
  aiProvider?: string;
  atsAnalysis?: {
    atsScore: number;
    issues: string[];
    recommendations: string[];
    summary: string;
  };
  createdAt: string;
  jobDescription?: string;
}

export interface AnalysisHistory {
  _id: string;
  analysis: Analysis;
  jobDescription: string;
  createdAt: string;
}