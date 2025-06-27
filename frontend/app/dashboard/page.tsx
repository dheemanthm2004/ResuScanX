'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { analysisAPI } from '@/lib/api';
import { AnalysisResult, AnalysisHistory, User } from '@/types';
import { Upload, FileText, BarChart3, History, LogOut, Brain, Eye, TrendingUp, AlertCircle, Home, MessageCircle, CheckCircle } from 'lucide-react';
import SkillsChart from '@/components/SkillsChart';
import ChatBot from '@/components/ChatBot';

interface AnalysisForm {
  resume: FileList;
  jobDescription: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'analyze' | 'history' | 'ats'>('analyze');
  const [showChat, setShowChat] = useState(false);
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AnalysisForm>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    loadHistory();
  }, [router]);

  const loadHistory = async () => {
    try {
      const response = await analysisAPI.getHistory();
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const onSubmit = async (data: AnalysisForm) => {
    setLoading(true);
    setResult(null);
    
    try {
      const formData = new FormData();
      formData.append('resume', data.resume[0]);
      formData.append('jobDescription', data.jobDescription);
      
      const response = await analysisAPI.analyze(formData);
      setResult(response.data);
      toast.success('Analysis completed!');
      reset();
      loadHistory();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6 transition-colors"
              >
                <Home className="h-5 w-5 mr-2" />
                Home
              </button>
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-3">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gradient">ResuScanX Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-700">
                  👋 Hey, {user.name}!
                </div>
              </div>
              <button onClick={logout} className="text-gray-500 hover:text-gray-700">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-2 mb-8">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'analyze' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:shadow-md'
            }`}
          >
            <FileText className="inline h-4 w-4 mr-2" />
            🚀 New Analysis
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'history' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:shadow-md'
            }`}
          >
            <History className="inline h-4 w-4 mr-2" />
            📈 History
          </button>
          <button
            onClick={() => setActiveTab('ats')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'ats' 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:shadow-md'
            }`}
          >
            <CheckCircle className="inline h-4 w-4 mr-2" />
            🤖 ATS Check
          </button>
        </div>

        {activeTab === 'analyze' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Form */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Upload Resume & Job Description</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume (PDF)
                  </label>
                  <input
                    {...register('resume', { required: 'Resume is required' })}
                    type="file"
                    accept=".pdf"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-secondary"
                  />
                  {errors.resume && (
                    <p className="mt-1 text-sm text-red-600">{errors.resume.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                  </label>
                  <textarea
                    {...register('jobDescription', { required: 'Job description is required' })}
                    rows={8}
                    placeholder="Paste the job description here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                  {errors.jobDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.jobDescription.message}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Upload className="animate-spin h-4 w-4 mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analyze Resume
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-6">
                {/* Header with Chat Toggle */}
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      showChat 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'bg-white/80 text-gray-600 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    AI Assistant (Gemini)
                  </button>
                </div>

                <div className={`grid gap-6 ${showChat ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  <div className={showChat ? 'lg:col-span-2 space-y-6' : 'space-y-6'}>
                    {/* Chart and Score */}
                    <SkillsChart 
                      matchedSkills={result.analysis.skillsMatch.length}
                      missingSkills={result.analysis.skillsGap.length}
                      matchScore={result.analysis.matchScore}
                    />

                    {/* Detailed Analysis */}
                    <div className="card">
                      <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                        Detailed Analysis
                      </h2>
                      
                      {/* Summary */}
                      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Summary
                        </h3>
                        <p className="text-gray-700">{result.analysis.summary}</p>
                      </div>

                      {/* Skills Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Matching Skills */}
                        <div>
                          <h3 className="font-semibold text-green-700 mb-3 flex items-center">
                            ✓ Matching Skills ({result.analysis.skillsMatch.length})
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {result.analysis.skillsMatch.map((skill, index) => (
                              <span key={index} className="skill-match">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Skills Gap */}
                        <div>
                          <h3 className="font-semibold text-red-700 mb-3 flex items-center">
                            ✗ Skills to Develop ({result.analysis.skillsGap.length})
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {result.analysis.skillsGap.map((skill, index) => (
                              <span key={index} className="skill-gap">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="mt-6">
                        <h3 className="font-semibold text-gray-900 mb-3">💡 Recommendations</h3>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <ul className="space-y-2">
                            {result.analysis.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-yellow-600 mr-2">•</span>
                                <span className="text-gray-700">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Dual AI Reports */}
                      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* AI Report */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                            🤖 {result.aiProvider || 'AI Analysis'}
                            {result.aiReport && result.aiReport !== '🤖 AI analysis temporarily unavailable' && (
                              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Live AI</span>
                            )}
                          </h3>
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                              {result.aiReport || 'AI analysis in progress...'}
                            </pre>
                          </div>
                        </div>

                        {/* Fallback Report */}
                        {result.fallbackReport && (
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                              📊 Intelligent Analysis
                              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Algorithm</span>
                            </h3>
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                                {result.fallbackReport}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Chat Sidebar */}
                  {showChat && (
                    <div className="lg:col-span-1">
                      <div className="sticky top-8">
                        <ChatBot analysisId={result.id} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Analysis History</h2>
              <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                💬 Click any analysis to chat with AI about your results
              </div>
            </div>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No analyses yet. Start by uploading your first resume!</p>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div 
                    key={item._id} 
                    onClick={() => router.push(`/analysis/${item._id}`)}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-blue-300 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className={`text-2xl font-bold ${getScoreColor(item.analysis.matchScore)}`}>
                          {item.analysis.matchScore}%
                        </div>
                        <p className="text-gray-600 text-sm">
                          {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-green-600">
                            ✓ {item.analysis.skillsMatch.length} matched
                          </span>
                          <span className="text-red-600">
                            ✗ {item.analysis.skillsGap.length} missing
                          </span>
                          <Eye className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Job Description Preview */}
                    {item.jobDescription && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Job Description:</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.jobDescription.substring(0, 150)}...
                        </p>
                      </div>
                    )}
                    
                    {/* Skills Preview */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {item.analysis.skillsMatch.slice(0, 5).map((skill, index) => (
                        <span key={index} className="skill-match text-xs">
                          {skill}
                        </span>
                      ))}
                      {item.analysis.skillsMatch.length > 5 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{item.analysis.skillsMatch.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'ats' && (
          <div className="card text-center">
            <div className="p-8">
              <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl w-fit mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Free ATS Checker</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Check if your resume will pass through Applicant Tracking Systems. 
                No signup required - completely free!
              </p>
              <button
                onClick={() => router.push('/ats-checker')}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                🤖 Check ATS Compatibility
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
