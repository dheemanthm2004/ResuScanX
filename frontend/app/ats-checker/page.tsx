'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, CheckCircle, AlertCircle, Info, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { atsAPI } from '@/lib/api';

interface ATSForm {
  resume: FileList;
}

interface ATSResult {
  atsScore: number;
  issues: string[];
  recommendations: string[];
  summary: string;
}

export default function ATSCheckerPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ATSForm>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const onSubmit = async (data: ATSForm) => {
    setLoading(true);
    setResult(null);
    
    try {
      const formData = new FormData();
      formData.append('resume', data.resume[0]);
      
      const response = await atsAPI.checkATS(formData);
      
      setResult(response.data.atsAnalysis);
      toast.success('ATS analysis completed!');
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'ATS analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-6">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
              <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl mr-3">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gradient">Free ATS Checker</h1>
            </div>
            <div className="text-sm text-gray-600">
              No signup required • 100% Free
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full text-sm font-medium text-emerald-700 mb-6">
            🤖 AI-Powered ATS Analysis
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Beat the ATS System
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Check if your resume will pass through Applicant Tracking Systems. 
            Get instant feedback and actionable recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Upload className="h-5 w-5 mr-2 text-emerald-600" />
              Upload Your Resume
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume (PDF only)
                </label>
                <input
                  {...register('resume', { required: 'Resume is required' })}
                  type="file"
                  accept=".pdf"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-emerald-600 file:to-teal-600 file:text-white hover:file:from-emerald-700 hover:file:to-teal-700 file:transition-all"
                />
                {errors.resume && (
                  <p className="mt-1 text-sm text-red-600">{errors.resume.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Upload className="animate-spin h-4 w-4 mr-2 inline" />
                    Analyzing ATS Compatibility...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 inline" />
                    Check ATS Compatibility
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">What is ATS?</p>
                  <p>Applicant Tracking Systems scan resumes before human recruiters see them. 90% of large companies use ATS to filter candidates.</p>
                </div>
              </div>
            </div>
          </div>

          {result ? (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-emerald-600" />
                ATS Compatibility Results
              </h3>
              
              <div className="text-center mb-6">
                <div className={`text-5xl font-bold ${getScoreColor(result.atsScore)} mb-2`}>
                  {result.atsScore}%
                </div>
                <p className="text-gray-600">ATS Compatibility Score</p>
                <p className="text-sm text-gray-700 mt-2">{result.summary}</p>
              </div>

              {result.issues.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Issues Found ({result.issues.length})
                  </h4>
                  <ul className="space-y-2">
                    {result.issues.map((issue, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="text-red-500 mr-2 mt-0.5">•</span>
                        <span className="text-gray-700">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold text-emerald-700 mb-3 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Recommendations ({result.recommendations.length})
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="text-emerald-500 mr-2 mt-0.5">•</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">ATS Pro Tips</h3>
              <div className="space-y-3">
                {[
                  '📄 Use standard fonts like Arial or Calibri',
                  '📝 Include standard section headers',
                  '🎯 Use keywords from job descriptions',
                  '📧 Place contact info at the top',
                  '🚫 Avoid tables and graphics',
                  '💼 Use bullet points over paragraphs',
                  '📱 Save in both PDF and Word formats',
                  '🔍 Use standard job titles'
                ].map((tip, index) => (
                  <div key={index} className="flex items-start text-sm">
                    <span className="mr-3">{tip.split(' ')[0]}</span>
                    <span className="text-gray-700">{tip.substring(tip.indexOf(' ') + 1)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center card-gradient">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Want More Advanced Analysis?
          </h3>
          <p className="text-gray-600 mb-6">
            Get AI-powered resume analysis, skill gap identification, and personalized career coaching.
          </p>
          {isLoggedIn ? (
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary"
            >
              ✨ Go to Full Analysis
            </button>
          ) : (
            <Link href="/register" className="btn-primary">
              ✨ Try Full Analysis Free
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}