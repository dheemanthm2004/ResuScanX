'use client';

import { useState } from 'react';
import { AnalysisResult } from '@/types';
import { MessageCircle } from 'lucide-react';
import UploadForm from './UploadForm';
import ComprehensiveChart from '@/components/ComprehensiveChart';
import SkillsChart from '@/components/SkillsChart';
import ResultsDisplay from '@/components/analysis/ResultsDisplay';
import ChatBot from '@/components/ChatBot';

interface AnalysisTabProps {
  onSubmit: (data: { resume: FileList; jobDescription: string }) => void;
  loading: boolean;
  result: AnalysisResult | null;
}

export default function AnalysisTab({ onSubmit, loading, result }: AnalysisTabProps) {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="space-y-12">
      <UploadForm onSubmit={onSubmit} loading={loading} />

      {result && (
        <div className="space-y-8">
          {/* Results Header */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  ✨ Analysis Complete
                </h2>
                <p className="text-gray-600 text-lg">Your resume has been analyzed by our AI systems</p>
              </div>
              <button
                onClick={() => setShowChat(!showChat)}
                className={`flex items-center px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                  showChat 
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-2xl' 
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-xl border-2 border-gray-200'
                }`}
              >
                <MessageCircle className="h-6 w-6 mr-3" />
                AI Career Coach
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className={`grid gap-8 ${showChat ? 'grid-cols-1 xl:grid-cols-4' : 'grid-cols-1'}`}>
            <div className={showChat ? 'xl:col-span-3 space-y-8' : 'space-y-8'}>
              {/* Visual Charts */}
              {result.analysis.breakdown ? (
                <ComprehensiveChart
                  matchScore={result.analysis.matchScore}
                  eligibilityScore={result.analysis.breakdown.eligibilityScore}
                  skillScore={result.analysis.breakdown.skillScore}
                  skillsMatch={result.analysis.skillsMatch.length}
                  skillsGap={result.analysis.skillsGap.length}
                  verdict={result.analysis.verdict || 'UNKNOWN'}
                />
              ) : (
                <SkillsChart 
                  matchedSkills={result.analysis.skillsMatch.length}
                  missingSkills={result.analysis.skillsGap.length}
                  matchScore={result.analysis.matchScore}
                />
              )}

              <ResultsDisplay result={result} />
            </div>

            {/* Chat Sidebar */}
            {showChat && (
              <div className="xl:col-span-1">
                <div className="sticky top-24">
                  <ChatBot analysisId={result.id} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}