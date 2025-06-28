'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { analysisAPI } from '@/lib/api';
import { AnalysisResult, AnalysisHistory, User } from '@/types';
import { Upload, FileText, BarChart3, History, LogOut, Eye, TrendingUp, AlertCircle, Home, MessageCircle, CheckCircle, Sparkles, Zap } from 'lucide-react';
import SkillsChart from '@/components/SkillsChart';
import ComprehensiveChart from '@/components/ComprehensiveChart';
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
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-8 transition-all duration-200 hover:scale-105"
              >
                <Home className="h-5 w-5 mr-2" />
                <span className="font-medium">Home</span>
              </button>
              
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <span className="text-white font-bold text-xl">R</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                    ResuScanX
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">AI Career Coach</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="px-4 py-2 bg-gradient-to-r from-violet-100 to-blue-100 rounded-2xl">
                <span className="text-violet-700 font-medium text-sm">👋 Hey, {user.name}!</span>
              </div>
              <button 
                onClick={logout} 
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-2 p-2 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20">
            <button
              onClick={() => setActiveTab('analyze')}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'analyze' 
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-xl' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <Sparkles className="inline h-5 w-5 mr-2" />
              New Analysis
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'history' 
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-xl' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <History className="inline h-5 w-5 mr-2" />
              History
            </button>
            <button
              onClick={() => setActiveTab('ats')}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'ats' 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <CheckCircle className="inline h-5 w-5 mr-2" />
              ATS Check
            </button>
          </div>
        </div>

        {activeTab === 'analyze' && (
          <div className="space-y-12">
            {/* Upload Section */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-10 hover:shadow-3xl transition-all duration-500">
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <Upload className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3">
                    Upload Your Resume
                  </h2>
                  <p className="text-gray-600 text-lg">Get instant AI-powered analysis and career insights</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                      Resume (PDF)
                    </label>
                    <input
                      {...register('resume', { required: 'Resume is required' })}
                      type="file"
                      accept=".pdf"
                      className="block w-full text-lg text-gray-600 file:mr-6 file:py-4 file:px-8 file:rounded-2xl file:border-0 file:text-lg file:font-semibold file:bg-gradient-to-r file:from-violet-600 file:to-purple-600 file:text-white hover:file:from-violet-700 hover:file:to-purple-700 file:transition-all file:shadow-lg hover:file:shadow-xl"
                    />
                    {errors.resume && (
                      <p className="mt-2 text-sm text-rose-600">{errors.resume.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                      Job Description
                    </label>
                    <textarea
                      {...register('jobDescription', { required: 'Job description is required' })}
                      rows={8}
                      placeholder="Paste the job description here..."
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-400 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                    {errors.jobDescription && (
                      <p className="mt-2 text-sm text-rose-600">{errors.jobDescription.message}</p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none text-lg"
                  >
                    {loading ? (
                      <>
                        <Upload className="animate-spin h-6 w-6 mr-3 inline" />
                        Analyzing Your Resume...
                      </>
                    ) : (
                      <>
                        <Zap className="h-6 w-6 mr-3 inline" />
                        Analyze with AI
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Results Section */}
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

                    {/* Detailed Analysis */}
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
        )}

        {activeTab === 'history' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-gray-900">Analysis History</h2>
                <div className="text-sm text-violet-700 bg-violet-100 px-4 py-2 rounded-2xl font-medium">
                  💬 Click any analysis to chat with AI about your results
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
        )}

        {activeTab === 'ats' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Free ATS Checker</h2>
              <p className="text-gray-600 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Check if your resume will pass through Applicant Tracking Systems. 
                No signup required - completely free!
              </p>
              <button
                onClick={() => router.push('/ats-checker')}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-10 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-lg"
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