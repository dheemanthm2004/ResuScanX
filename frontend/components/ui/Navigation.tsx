'use client';

import { Sparkles, History, CheckCircle } from 'lucide-react';

interface NavigationProps {
  activeTab: 'analyze' | 'history' | 'ats';
  onTabChange: (tab: 'analyze' | 'history' | 'ats') => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="flex justify-center mb-12">
      <div className="flex space-x-2 p-2 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20">
        <button
          onClick={() => onTabChange('analyze')}
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
          onClick={() => onTabChange('history')}
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
          onClick={() => onTabChange('ats')}
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
  );
}