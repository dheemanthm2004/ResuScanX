'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { Home, LogOut, Sparkles } from 'lucide-react';

interface DashboardHeaderProps {
  user: User;
  onLogout: () => void;
}

export default function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  const router = useRouter();
  const [isDemo, setIsDemo] = useState(false);
  
  useEffect(() => {
    setIsDemo(localStorage.getItem('demoMode') === 'true');
  }, []);

  return (
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
                <p className="text-sm text-gray-600 -mt-1">AI Resume vs Job Description Analyzer</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {isDemo ? (
              <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-blue-700 font-medium text-sm">Demo Mode</span>
              </div>
            ) : (
              <div className="px-4 py-2 bg-gradient-to-r from-violet-100 to-blue-100 rounded-2xl">
                <span className="text-violet-700 font-medium text-sm">👋 Hey, {user.name}!</span>
              </div>
            )}
            <button 
              onClick={onLogout} 
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
              title={isDemo ? "Exit Demo Mode" : "Logout"}
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}