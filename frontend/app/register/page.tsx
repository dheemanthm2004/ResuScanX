'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';
import { ArrowLeft, User, Mail, Lock, Sparkles, Zap } from 'lucide-react';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register(data.name, data.email, data.password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Welcome to ResuScanX! 🎉');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
      <div className="flex items-center justify-center py-12 px-6">
        <div className="max-w-md w-full">
          {/* Welcome Section */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Zap className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
              Join ResuScanX
            </h2>
            <p className="text-gray-600 text-lg">
              Start your AI-powered career transformation today
            </p>
          </div>
          
          {/* Benefits */}
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 mb-8 border border-violet-200">
            <h3 className="font-bold text-gray-900 mb-4 text-center">What you'll get:</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </span>
                <span className="text-gray-700">Unlimited resume analysis with 4 AI providers</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </span>
                <span className="text-gray-700">Free ATS compatibility checking</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">✓</span>
                </span>
                <span className="text-gray-700">Personal AI career coach powered by Gemini</span>
              </div>
            </div>
          </div>
          
          {/* Register Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('name', { required: 'Name is required' })}
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-rose-600">{errors.name.message}</p>
                )}
              </div>
              
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
                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 transition-all duration-200 bg-white/50 backdrop-blur-sm"
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
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    type="password"
                    placeholder="Create a password"
                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-rose-600">{errors.password.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('confirmPassword', { required: 'Please confirm your password' })}
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-rose-600">{errors.confirmPassword.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none text-lg"
              >
                {loading ? (
                  <>
                    <Sparkles className="animate-spin h-5 w-5 mr-2 inline" />
                    Creating your account...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2 inline" />
                    Create Free Account
                  </>
                )}
              </button>
            </form>
            
            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
                >
                  Sign in here →
                </Link>
              </p>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            {/* <p className="text-xs text-gray-500 mb-4">Trusted by job seekers worldwide</p> */}
            <div className="flex justify-center space-x-6 text-xs text-gray-600">
              <span className="flex items-center">
                🔒 <span className="ml-1">Secure & Private</span>
              </span>
              <span className="flex items-center">
                🆓 <span className="ml-1">Always Free</span>
              </span>
              <span className="flex items-center">
                ⚡ <span className="ml-1">Instant Results</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}