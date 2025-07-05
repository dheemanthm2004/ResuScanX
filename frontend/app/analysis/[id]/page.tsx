'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { analysisAPI } from '@/lib/api';
import { AnalysisResult } from '@/types';
import SkillsChart from '@/components/SkillsChart';
import ComprehensiveChart from '@/components/ComprehensiveChart';
import ChatBot from '@/components/ChatBot';
import ExportButton from '@/components/ExportButton';
import { ArrowLeft, Calendar, FileText, MessageCircle, TrendingUp, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AnalysisDetailPage() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    loadAnalysis();
  }, [params.id]);

  const loadAnalysis = async () => {
    try {
      const response = await analysisAPI.getAnalysis(params.id as string);
      setAnalysis(response.data);
    } catch (error) {
      toast.error('Failed to load analysis');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
              <div className="flex items-center text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(analysis.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex space-x-3">
              <ExportButton analysis={analysis} />
              <button
                onClick={() => setShowChat(!showChat)}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  showChat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                AI Career Coach
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-8 ${showChat ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {/* Main Content */}
          <div className={showChat ? 'lg:col-span-2' : 'col-span-1'}>
            {/* Visual Analysis - Always show comprehensive chart */}
            <ComprehensiveChart
              matchScore={analysis.analysis.matchScore}
              eligibilityScore={analysis.analysis.breakdown?.eligibilityScore || Math.max(analysis.analysis.matchScore - 10, 30)}
              skillScore={analysis.analysis.breakdown?.skillScore || 
                (analysis.analysis.skillsMatch.length > 0 ? 
                  Math.round((analysis.analysis.skillsMatch.length / (analysis.analysis.skillsMatch.length + analysis.analysis.skillsGap.length)) * 100) : 50)
              }
              skillsMatch={analysis.analysis.skillsMatch.length}
              skillsGap={analysis.analysis.skillsGap.length}
              verdict={analysis.analysis.verdict || (analysis.analysis.matchScore >= 70 ? 'QUALIFIED' : analysis.analysis.matchScore >= 40 ? 'UNDERQUALIFIED' : 'COMPLETELY_UNQUALIFIED')}
            />


            {/* Job Description */}
            {analysis.jobDescription && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Job Description
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{analysis.jobDescription}</p>
                </div>
              </div>
            )}

            {/* Detailed Analysis */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                Detailed Analysis
              </h3>
              
              {/* Skills Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-green-700 mb-3">
                    ✅ Matching Skills ({analysis.analysis.skillsMatch.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.analysis.skillsMatch.map((skill, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-red-700 mb-3">
                    ❌ Skills to Develop ({analysis.analysis.skillsGap.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.analysis.skillsGap.map((skill, index) => (
                      <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">💡 Recommendations</h4>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    {analysis.analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Reports */}
            <div className="space-y-6">
              {/* Detailed AI Analysis */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200">
                <h4 className="font-bold text-gray-900 mb-6 flex items-center text-xl">
                  🤖 {analysis.aiProvider || 'Multi-AI Detailed Analysis'}
                  {analysis.aiReport && !analysis.aiReport.includes('temporarily unavailable') && (
                    <span className="ml-3 px-4 py-2 bg-emerald-100 text-emerald-700 text-sm rounded-full font-medium">Live AI Report</span>
                  )}
                </h4>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 max-h-96 overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                      {analysis.aiReport || 'Generating comprehensive AI analysis...'}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Algorithm Analysis */}
              {analysis.fallbackReport && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200">
                  <h4 className="font-bold text-gray-900 mb-6 flex items-center text-xl">
                    📊 Algorithm Analysis
                    <span className="ml-3 px-4 py-2 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">Structured Analysis</span>
                  </h4>
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                      {analysis.fallbackReport}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Sidebar */}
          {showChat && (
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <ChatBot analysisId={params.id as string} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}