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
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-3">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gradient">ResuScanX</h1>
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
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-700 mb-8">
            🔥 Powered by Multi-AI Technology
          </div>
          <h2 className="text-5xl font-bold text-gray-900 sm:text-7xl mb-6">
            Your Resume's
            <span className="text-gradient block">AI Career Coach</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get instant AI-powered insights on resume-job compatibility. 
            <span className="text-gradient font-semibold">Multi-AI analysis</span> meets beautiful design.
          </p>
          <div className="mt-10">
            {isLoggedIn ? (
              <Link href="/dashboard" className="btn-primary text-lg px-10 py-4">
                🚀 Start Free Analysis
              </Link>
            ) : (
              <Link href="/register" className="btn-primary text-lg px-10 py-4">
                ✨ Get Started Free
              </Link>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-gradient text-center group hover:scale-105 transition-transform duration-300">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl w-fit mx-auto mb-6">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">🧠 Smart AI Parsing</h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced NLP extracts skills, experience, and key insights from your PDF resume with precision.
            </p>
          </div>
          
          <div className="card-gradient text-center group hover:scale-105 transition-transform duration-300">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl w-fit mx-auto mb-6">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">📊 Multi-AI Analysis</h3>
            <p className="text-gray-600 leading-relaxed">
              Powered by OpenRouter, Mistral & Cohere APIs for comprehensive compatibility scoring.
            </p>
          </div>
          
          <div className="card-gradient text-center group hover:scale-105 transition-transform duration-300">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl w-fit mx-auto mb-6">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">💬 AI Career Coach</h3>
            <p className="text-gray-600 leading-relaxed">
              Interactive Gemini-powered assistant provides personalized career guidance and tips.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-24 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Built with Cutting-Edge AI</h3>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Leveraging the latest in artificial intelligence and machine learning</p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-5 py-3 rounded-full font-medium shadow-sm hover:shadow-md transition-shadow">🤖 OpenRouter AI</span>
            <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-5 py-3 rounded-full font-medium shadow-sm hover:shadow-md transition-shadow">🧠 Mistral AI</span>
            <span className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 px-5 py-3 rounded-full font-medium shadow-sm hover:shadow-md transition-shadow">💎 Cohere NLP</span>
            <span className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 px-5 py-3 rounded-full font-medium shadow-sm hover:shadow-md transition-shadow">✨ Google Gemini</span>
            <span className="bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 px-5 py-3 rounded-full font-medium shadow-sm hover:shadow-md transition-shadow">📊 Advanced Analytics</span>
          </div>
        </div>
      </main>
    </div>
  );
}