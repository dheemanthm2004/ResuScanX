'use client';

import { AnalysisResult } from '@/types';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
        <TrendingUp className="h-7 w-7 mr-3 text-violet-600" />
        Detailed Analysis
      </h3>
      
      {/* Summary */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-violet-50 rounded-2xl border border-blue-200">
        <h4 className="font-bold text-gray-900 mb-3 flex items-center text-lg">
          <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
          Summary
        </h4>
        <p className="text-gray-700 text-lg leading-relaxed">{result.analysis.summary}</p>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h4 className="font-bold text-emerald-700 mb-4 text-xl">
            ✓ Matching Skills ({result.analysis.skillsMatch.length})
          </h4>
          <div className="flex flex-wrap gap-3">
            {result.analysis.skillsMatch.map((skill, index) => (
              <span key={index} className="skill-match text-base">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-rose-700 mb-4 text-xl">
            ✗ Skills to Develop ({result.analysis.skillsGap.length})
          </h4>
          <div className="flex flex-wrap gap-3">
            {result.analysis.skillsGap.map((skill, index) => (
              <span key={index} className="skill-gap text-base">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <h4 className="font-bold text-gray-900 mb-4 text-xl">💡 Recommendations</h4>
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
          <ul className="space-y-3">
            {result.analysis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="text-amber-600 mr-3 text-lg">•</span>
                <span className="text-gray-700 text-base leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Reports */}
      <div className="space-y-6">
        {/* Detailed AI Analysis */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200">
          <h4 className="font-bold text-gray-900 mb-6 flex items-center text-xl">
            🤖 {result.aiProvider || 'Multi-AI Detailed Analysis'}
            {result.aiReport && !result.aiReport.includes('temporarily unavailable') && (
              <span className="ml-3 px-4 py-2 bg-emerald-100 text-emerald-700 text-sm rounded-full font-medium">Live AI Report</span>
            )}
          </h4>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 max-h-96 overflow-y-auto">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                {result.aiReport || 'Generating comprehensive AI analysis...'}
              </pre>
            </div>
          </div>
        </div>

        {/* Algorithm Analysis */}
        {result.fallbackReport && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200">
            <h4 className="font-bold text-gray-900 mb-6 flex items-center text-xl">
              📊 Algorithm Analysis
              <span className="ml-3 px-4 py-2 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">Structured Analysis</span>
            </h4>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                {result.fallbackReport}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}