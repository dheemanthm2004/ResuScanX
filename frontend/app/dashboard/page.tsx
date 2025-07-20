'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { analysisAPI } from '@/lib/api';
import { AnalysisResult, AnalysisHistory, User } from '@/types';
import DashboardHeader from '@/components/ui/DashboardHeader';
import Navigation from '@/components/ui/Navigation';
import AnalysisTab from '@/components/dashboard/AnalysisTab';
import HistoryTab from '@/components/dashboard/HistoryTab';
import ATSTab from '@/components/dashboard/ATSTab';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'analyze' | 'history' | 'ats'>('analyze');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const isDemo = localStorage.getItem('demoMode') === 'true';
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    loadHistory();
    
    if (isDemo) {
      toast.success('Welcome to demo mode! 🚀', {
        duration: 5000,
        icon: '👋'
      });
    }
  }, [router]);

  const loadHistory = async () => {
    try {
      const response = await analysisAPI.getHistory();
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const handleAnalysis = async (data: { resume: FileList; jobDescription: string }) => {
    setLoading(true);
    setResult(null);
    
    try {
      const formData = new FormData();
      formData.append('resume', data.resume[0]);
      formData.append('jobDescription', data.jobDescription);
      
      const response = await analysisAPI.analyze(formData);
      setResult(response.data);
      toast.success('Analysis completed!');
      loadHistory();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('demoMode');
    router.push('/');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <DashboardHeader user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'analyze' && (
          <AnalysisTab 
            onSubmit={handleAnalysis} 
            loading={loading} 
            result={result} 
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab history={history} />
        )}

        {activeTab === 'ats' && (
          <ATSTab />
        )}
      </div>
    </div>
  );
}