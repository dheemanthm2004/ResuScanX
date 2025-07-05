'use client';

import { useRouter } from 'next/navigation';
import { AnalysisHistory } from '@/types';
import { FileText, Eye } from 'lucide-react';

interface HistoryTabProps {
  history: AnalysisHistory[];
}

export default function HistoryTab({ history }: HistoryTabProps) {
  const router = useRouter();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-900">Analysis History</h2>
          <div className="text-sm text-violet-700 bg-violet-100 px-4 py-2 rounded-2xl font-medium">
            💬 Click any analysis for detailed AI insights and chat
          </div>
        </div>
        
        {history.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No analyses yet. Start by uploading your first resume!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((item) => (
              <div 
                key={item._id} 
                onClick={() => router.push(`/analysis/${item._id}`)}
                className="border-2 border-gray-200 rounded-2xl p-6 hover:bg-white hover:border-violet-300 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className={`text-3xl font-bold ${getScoreColor(item.analysis.matchScore)} mb-1`}>
                      {item.analysis.matchScore}%
                    </div>
                    <p className="text-gray-600">
                      {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-6 text-sm mb-2">
                      <span className="text-emerald-600 font-medium">
                        ✓ {item.analysis.skillsMatch.length} matched
                      </span>
                      <span className="text-rose-600 font-medium">
                        ✗ {item.analysis.skillsGap.length} missing
                      </span>
                    </div>
                    <Eye className="h-5 w-5 text-gray-400 group-hover:text-violet-600 transition-colors ml-auto" />
                  </div>
                </div>
                
                {item.jobDescription && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Job Description:</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.jobDescription.substring(0, 200)}...
                    </p>
                  </div>
                )}
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.analysis.skillsMatch.slice(0, 6).map((skill, index) => (
                    <span key={index} className="skill-match text-xs">
                      {skill}
                    </span>
                  ))}
                  {item.analysis.skillsMatch.length > 6 && (
                    <span className="text-xs text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
                      +{item.analysis.skillsMatch.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}