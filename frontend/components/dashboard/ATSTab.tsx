'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function ATSTab() {
  const router = useRouter();

  return (
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
  );
}