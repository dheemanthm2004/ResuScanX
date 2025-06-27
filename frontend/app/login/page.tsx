'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';
import { ArrowLeft, Mail, Lock, Sparkles } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response = await authAPI.login(data.email, data.password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Welcome back! 🎉');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-all duration-200 hover:scale-105">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Back to Home</span>
            </Link>
            
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
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  ResuScanX
                </h1>
                <p className="text-xs text-gray-500 -mt-1">AI Career Coach</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center py-16 px-6">
        <div className="max-w-md w-full">
          {/* Welcome Section */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-lg">
              Sign in to continue your AI-powered career journey
            </p>
          </div>
          
          {/* Login Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\\S+@\\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-400 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-rose-600">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('password', { required: 'Password is required' })}
                    type="password"
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-400 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-rose-600">{errors.password.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none text-lg"
              >
                {loading ? (
                  <>
                    <Sparkles className="animate-spin h-5 w-5 mr-2 inline" />
                    Signing you in...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2 inline" />
                    Sign In
                  </>
                )}
              </button>
            </form>
            
            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link 
                  href="/register" 
                  className="font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent hover:from-violet-700 hover:to-purple-700 transition-all duration-200"
                >
                  Create one here →
                </Link>
              </p>
            </div>
          </div>
          
          {/* Features Preview */}
          <div className="mt-8 text-center">
            <div className="flex justify-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center">
                🤖 <span className="ml-1">Multi-AI Analysis</span>
              </span>
              <span className="flex items-center">
                📊 <span className="ml-1">ATS Compatibility</span>
              </span>
              <span className="flex items-center">
                💬 <span className="ml-1">AI Career Coach</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}