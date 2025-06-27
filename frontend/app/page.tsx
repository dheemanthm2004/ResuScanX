'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain, FileText, BarChart3, Zap } from 'lucide-react';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">R</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                    ResuScanX
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">AI Career Coach</p>
                </div>
              </div>
            </div>
            <div className="space-x-4">
              {isLoggedIn ? (
                <Link href="/dashboard" className="btn-primary">
                  🚀 Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary">
                    Sign In
                  </Link>
                  <Link href="/register" className="btn-primary">
                    ✨ Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full text-sm font-semibold text-violet-700 mb-8 shadow-lg">
            ✨ Powered by Advanced AI Technology
          </div>
          <h2 className="text-6xl font-bold text-gray-900 sm:text-8xl mb-8 leading-tight">
            Match Your Resume to
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent block">Any Job Description</span>
          </h2>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6">
            Upload your resume + paste any job description. Get instant AI-powered compatibility analysis, skill gap identification, and personalized recommendations to land that job.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-lg text-gray-700 mb-8">
            <span className="flex items-center bg-white/60 px-4 py-2 rounded-2xl shadow-sm">
              📝 <span className="ml-2 font-medium">Resume vs Job Description</span>
            </span>
            <span className="flex items-center bg-white/60 px-4 py-2 rounded-2xl shadow-sm">
              📊 <span className="ml-2 font-medium">Compatibility Scoring</span>
            </span>
            <span className="flex items-center bg-white/60 px-4 py-2 rounded-2xl shadow-sm">
              🎯 <span className="ml-2 font-medium">Skill Gap Analysis</span>
            </span>
            <span className="flex items-center bg-white/60 px-4 py-2 rounded-2xl shadow-sm">
              💬 <span className="ml-2 font-medium">AI Interview Prep</span>
            </span>
          </div>
          <div className="mt-10 space-y-8">
            {isLoggedIn ? (
              <Link href="/dashboard" className="btn-primary text-lg px-10 py-4">
                🚀 Start Free Analysis
              </Link>
            ) : (
              <Link href="/register" className="btn-primary text-lg px-10 py-4">
                ✨ Get Started Free
              </Link>
            )}
            <div className="mt-4">
              <Link href="/ats-checker" className="btn-secondary text-lg px-8 py-3">
                🤖 Free ATS Checker
              </Link>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">How It Works</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Simple 3-step process to optimize your resume for any job</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Upload Resume</h4>
              <p className="text-gray-600 text-lg leading-relaxed">Drop your PDF resume file. Our AI extracts all your skills, experience, and qualifications.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Paste Job Description</h4>
              <p className="text-gray-600 text-lg leading-relaxed">Copy-paste any job posting you want to apply for. AI analyzes the requirements.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Get Match Analysis</h4>
              <p className="text-gray-600 text-lg leading-relaxed">See compatibility score, skill gaps, and get targeted recommendations to land that job.</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-gradient text-center group hover:scale-105 transition-transform duration-300">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl w-fit mx-auto mb-6">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">📝 Resume-JD Matching</h3>
            <p className="text-gray-600 leading-relaxed">
              Upload your resume PDF + paste job description. AI analyzes compatibility and identifies exact skill matches.
            </p>
          </div>
          
          <div className="card-gradient text-center group hover:scale-105 transition-transform duration-300">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl w-fit mx-auto mb-6">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">📊 Compatibility Scoring</h3>
            <p className="text-gray-600 leading-relaxed">
              Get precise match percentage showing how well your resume aligns with the job requirements.
            </p>
          </div>
          
          <div className="card-gradient text-center group hover:scale-105 transition-transform duration-300">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl w-fit mx-auto mb-6">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">💬 Job-Specific Coaching</h3>
            <p className="text-gray-600 leading-relaxed">
              AI coach understands both your resume and the job description to give targeted interview preparation.
            </p>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="mt-32">
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-3xl p-12 border border-violet-200">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-6">Why ResuScanX Stands Out</h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">The only platform combining multiple AI providers with real ATS simulation</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl font-bold">4</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">AI Providers</h4>
                <p className="text-gray-600 text-sm">OpenRouter, Mistral, Cohere & Gemini working together</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl font-bold">90%</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">ATS Success</h4>
                <p className="text-gray-600 text-sm">Real ATS compatibility analysis with actionable fixes</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl">✨</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Free Forever</h4>
                <p className="text-gray-600 text-sm">Core features always free, no hidden costs or limits</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-2xl">💬</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">AI Coach</h4>
                <p className="text-gray-600 text-sm">Personal career guidance powered by Gemini AI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Feature Set */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">Everything You Need to Land Your Dream Job</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">From resume optimization to interview preparation - all powered by AI</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Resume vs Job Description</h4>
                  <p className="text-gray-600">Upload resume PDF + paste job description. AI compares them to find exact skill matches and gaps</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Compatibility Percentage</h4>
                  <p className="text-gray-600">Get precise match score showing how well your skills align with job requirements</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Real ATS Testing</h4>
                  <p className="text-gray-600">Simulate real Applicant Tracking Systems to ensure your resume gets seen by humans</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Job-Specific Coaching</h4>
                  <p className="text-gray-600">AI coach knows your resume AND the job description to give targeted interview preparation</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">📊</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Visual Analytics</h4>
                  <p className="text-gray-600">Beautiful charts and insights help you understand your strengths and improvement areas</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">📈</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Progress Tracking</h4>
                  <p className="text-gray-600">Track your resume improvements over time with detailed history and analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-32 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Built with Cutting-Edge AI</h3>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Leveraging the latest in artificial intelligence and machine learning</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">🤖 OpenRouter AI</span>
            <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">🧠 Mistral AI</span>
            <span className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">💎 Cohere NLP</span>
            <span className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">✨ Google Gemini</span>
            <span className="bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">📊 Advanced Analytics</span>
          </div>
        </div>
        {/* Signature Section */}
<footer className="py-6 mt-16 text-center">
  <p className="text-sm text-gray-500">
    Made with ❤️ by <span className="font-bold">Dheem</span>
  </p>
</footer>

      </main>
    </div>
  );
}