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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">ResuScan</h1>
            </div>
            <div className="space-x-4">
              {isLoggedIn ? (
                <Link href="/dashboard" className="btn-primary">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 hover:text-gray-900">
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary">
                    Get Started
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
          <h2 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            AI-Powered Resume Analysis
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Get intelligent insights on how well your resume matches job descriptions. 
            Powered by advanced AI, NLP, and machine learning algorithms.
          </p>
          <div className="mt-10">
            {isLoggedIn ? (
              <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
                Start Analysis
              </Link>
            ) : (
              <Link href="/register" className="btn-primary text-lg px-8 py-3">
                Get Started Free
              </Link>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Resume Parsing</h3>
            <p className="text-gray-600">
              Advanced NLP extracts skills, experience, and key information from your PDF resume.
            </p>
          </div>
          
          <div className="card text-center">
            <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Match Analysis</h3>
            <p className="text-gray-600">
              AI-powered algorithms calculate compatibility scores and identify skill gaps.
            </p>
          </div>
          
          <div className="card text-center">
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Intelligent Reports</h3>
            <p className="text-gray-600">
              Get detailed recommendations and actionable insights powered by GenAI.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Powered by Advanced AI/ML</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="bg-white px-4 py-2 rounded-full shadow">Natural Language Processing</span>
            <span className="bg-white px-4 py-2 rounded-full shadow">Machine Learning</span>
            <span className="bg-white px-4 py-2 rounded-full shadow">Generative AI</span>
            <span className="bg-white px-4 py-2 rounded-full shadow">Semantic Analysis</span>
            <span className="bg-white px-4 py-2 rounded-full shadow">Google Gemini</span>
          </div>
        </div>
      </main>
    </div>
  );
}