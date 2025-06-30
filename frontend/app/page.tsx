'use client';

import { useState, useEffect, useRef } from 'react';
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

  // Scroll animation hook
  const useScrollAnimation = (): [React.RefObject<HTMLDivElement>, boolean] => {
    const elementRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold: 0.1 }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => {
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      };
    }, []);

    return [elementRef, isVisible];
  };

  const [heroRef, heroVisible] = useScrollAnimation();
  const [howItWorksRef, howItWorksVisible] = useScrollAnimation();
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [whyUsRef, whyUsVisible] = useScrollAnimation();
  const [completeRef, completeVisible] = useScrollAnimation();
  const [techRef, techVisible] = useScrollAnimation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-purple-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="relative group">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                      <path d="M14 2v6h6"/>
                      <path d="M16 13H8"/>
                      <path d="M16 17H8"/>
                      <path d="M10 9H8"/>
                    </svg>
                  </div>
                 
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    ResuScanX
                  </h1>
                  <p className="text-sm text-gray-600">AI Resume vs Job Description Analyzer</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isLoggedIn ? (
                <Link href="/dashboard" className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-full hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                  🚀 Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="px-5 py-2.5 text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition-all duration-200">
                    Sign In
                  </Link>
                  <Link href="/register" className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-full hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                    ✨ Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-4 lg:pt-8">
        <div 
          ref={heroRef}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-1000 ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200/50 rounded-full text-sm font-bold text-violet-700 mb-10 shadow-lg backdrop-blur-sm">
              ✨ Powered by Advanced AI Technology
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
              Match Your Resume to
             <span
  className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block mt-4 mb-4"
  style={{ lineHeight: '1.2', paddingBottom: '4px' }}
>
  Any Job Description
</span>

            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Upload your resume + paste any job description. Get instant AI-powered compatibility analysis, skill gap identification, and personalized recommendations to land that job.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { icon: '📝', text: 'Resume vs Job Description' },
                { icon: '📊', text: 'Compatibility Scoring' },
                { icon: '🎯', text: 'Skill Gap Analysis' },
                
              ].map((item, index) => (
                <span 
                  key={index}
                  className="flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span className="font-semibold text-gray-700">{item.text}</span>
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
  {isLoggedIn ? (
    <Link
      href="/dashboard"
      className="px-12 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-lg rounded-full hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
    >
      🚀 Start Free Analysis
    </Link>
  ) : (
    <>
      <Link
        href="/register"
        className="px-12 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-lg rounded-full hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
      >
        ✨ Get Started Free
      </Link>

      <Link
  href="/ats-checker"
  className="relative inline-block px-10 py-3 pr-16 text-lg font-semibold rounded-full bg-white border-2 border-green-500 text-green-700 shadow-md hover:bg-green-100 hover:text-green-900 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
>
  <span className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-2 py-[2px] rounded-full shadow select-none uppercase tracking-wide">
    No Login Required
  </span>
  🤖 Free ATS Checker
</Link>

    </>
  )}
</div>

          </div>
        </div>

        {/* How It Works */}
        <div 
          ref={howItWorksRef}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-1000 delay-200 ${
            howItWorksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">How It Works</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Simple 3-step process to optimize your resume for any job</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { num: '1', title: 'Upload Resume', desc: 'Drop your PDF resume file. Our AI extracts all your skills, experience, and qualifications.', gradient: 'from-violet-500 to-purple-600' },
              { num: '2', title: 'Paste Job Description', desc: 'Copy-paste any job posting you want to apply for. AI analyzes the requirements.', gradient: 'from-blue-500 to-cyan-600' },
              { num: '3', title: 'Get Match Analysis', desc: 'See compatibility score, skill gaps, and get targeted recommendations to land that job.', gradient: 'from-emerald-500 to-teal-600' }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-110`}>
                  <span className="text-white font-black text-2xl">{step.num}</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h4>
                <p className="text-gray-600 text-lg leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div 
          ref={featuresRef}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-1000 delay-300 ${
            featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: '📝 Resume-JD Matching', desc: 'Upload your resume PDF + paste job description. AI analyzes compatibility and identifies exact skill matches.', gradient: 'from-blue-500 to-cyan-500' },
              { icon: BarChart3, title: '📊 Compatibility Scoring', desc: 'Get precise match percentage showing how well your resume aligns with the job requirements.', gradient: 'from-purple-500 to-pink-500' },
              { icon: Zap, title: '💬 Job-Specific Coaching', desc: 'AI coach understands both your resume and the job description to give targeted interview preparation.', gradient: 'from-emerald-500 to-teal-500' }
            ].map((feature, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 text-center group hover:bg-white/80 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/50">
                <div className={`p-4 bg-gradient-to-r ${feature.gradient} rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What Makes Us Different */}
        <div 
          ref={whyUsRef}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-1000 delay-400 ${
            whyUsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-gradient-to-br from-violet-50/80 to-purple-50/80 backdrop-blur-sm rounded-3xl p-12 border border-violet-200/30 shadow-xl">
            <div className="text-center mb-16">
              <h3 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">Why ResuScanX Stands Out</h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">The only platform combining multiple AI providers with real ATS simulation</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { num: '4', title: 'AI Providers', desc: 'OpenRouter, Mistral, Cohere & Gemini working together', gradient: 'from-violet-500 to-purple-600' },
                { num: '90%', title: 'ATS Success', desc: 'Real ATS compatibility analysis with actionable fixes', gradient: 'from-emerald-500 to-teal-600' },
                { icon: '✨', title: 'Free Forever', desc: 'Core features always free, no hidden costs or limits', gradient: 'from-blue-500 to-cyan-600' },
                { icon: '💬', title: 'AI Coach', desc: 'Personal career guidance powered by Gemini AI', gradient: 'from-pink-500 to-rose-600' }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <span className="text-white text-xl font-black">{stat.num || stat.icon}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{stat.title}</h4>
                  <p className="text-gray-600 text-sm">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Complete Feature Set */}
        <div 
          ref={completeRef}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-1000 delay-500 ${
            completeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">Proper Resume Analysis to Land Your Dream Job</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">From resume optimization to interview help - all powered by AI</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              {[
                { icon: FileText, title: 'Resume vs Job Description', desc: 'Upload resume PDF + paste job description. AI compares them to find exact skill matches and gaps', gradient: 'from-violet-500 to-purple-600' },
                { icon: BarChart3, title: 'Compatibility Percentage', desc: 'Get precise match score showing how well your skills align with job requirements', gradient: 'from-emerald-500 to-teal-600' },
                { icon: Zap, title: 'Real ATS Testing', desc: 'Simulate real Applicant Tracking Systems to ensure your resume gets seen by humans', gradient: 'from-blue-500 to-cyan-600' }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-8">
              {[
                { icon: Brain, title: 'Job-Specific Coaching', desc: 'AI coach knows your resume AND the job description to give targeted interview preparation', gradient: 'from-pink-500 to-rose-600' },
                { icon: '📊', title: 'Visual Analytics', desc: 'Beautiful charts and insights help you understand your strengths and improvement areas', gradient: 'from-amber-500 to-orange-600' },
                { icon: '📈', title: 'Progress Tracking', desc: 'Track your resume improvements over time with detailed history and analytics', gradient: 'from-indigo-500 to-purple-600' }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    {typeof feature.icon === 'string' ? (
                      <span className="text-white font-bold">{feature.icon}</span>
                    ) : (
                      <feature.icon className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div 
          ref={techRef}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center transition-all duration-1000 delay-600 ${
            techVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h3 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">Built with Cutting-Edge AI</h3>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-lg">Leveraging the latest in artificial intelligence and machine learning</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { text: '🤖 OpenRouter AI', colors: 'from-blue-100 to-blue-200 text-blue-700' },
              { text: '🧠 Mistral AI', colors: 'from-purple-100 to-purple-200 text-purple-700' },
              { text: '💎 Cohere NLP', colors: 'from-emerald-100 to-emerald-200 text-emerald-700' },
              { text: '✨ Google Gemini', colors: 'from-orange-100 to-orange-200 text-orange-700' },
              { text: '📊 Advanced Analytics', colors: 'from-pink-100 to-pink-200 text-pink-700' }
            ].map((tech, index) => (
              <span 
                key={index}
                className={`bg-gradient-to-r ${tech.colors} px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-white/50 backdrop-blur-sm`}
              >
                {tech.text}
              </span>
            ))}
          </div>
        </div>

        {/* Signature Section */}
        <footer className="py-8 text-center border-t border-gray-100 bg-white/50 backdrop-blur-sm">
          <p className="text-sm text-gray-500">
            Made with ❤️ by <span className="font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Dheem</span>
          </p>
        </footer>
      </main>
    </div>
  );
}
