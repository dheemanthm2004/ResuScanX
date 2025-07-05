'use client';

import { useForm } from 'react-hook-form';
import { Upload, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface UploadFormProps {
  onSubmit: (data: { resume: FileList; jobDescription: string }) => void;
  loading: boolean;
}

export default function UploadForm({ onSubmit, loading }: UploadFormProps) {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const jobDescription = watch('jobDescription', '');
  const wordCount = jobDescription ? jobDescription.trim().split(/\s+/).filter((word: string) => word.length > 0).length : 0;

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-10 hover:shadow-3xl transition-all duration-500">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Upload className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Upload Your Resume
          </h2>
          <p className="text-gray-600 text-lg">Get instant AI-powered analysis and career insights</p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              Resume (PDF)
            </label>
            <input
              {...register('resume', { required: 'Resume is required' })}
              type="file"
              accept=".pdf"
              className="block w-full text-lg text-gray-600 file:mr-6 file:py-4 file:px-8 file:rounded-2xl file:border-0 file:text-lg file:font-semibold file:bg-gradient-to-r file:from-violet-600 file:to-purple-600 file:text-white hover:file:from-violet-700 hover:file:to-purple-700 file:transition-all file:shadow-lg hover:file:shadow-xl"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.size > 5 * 1024 * 1024) {
                  toast.error('File size must be under 5MB for optimal processing');
                  e.target.value = '';
                }
              }}
            />
            {errors.resume && (
              <p className="mt-2 text-sm text-rose-600">{errors.resume.message as string}</p>
            )}
            <p className="mt-2 text-sm text-gray-600">
              📄 Max file size: 5MB • Supported: PDF only
            </p>
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              Job Description
            </label>
            <div className="relative">
              <textarea
                {...register('jobDescription', { 
                  required: 'Job description is required',
                  validate: {
                    wordCount: (value) => {
                      const words = value.trim().split(/\s+/).filter((word: string) => word.length > 0);
                      return words.length <= 2000 || 'Job description must be under 2000 words for optimal AI analysis';
                    }
                  }
                })}
                rows={8}
                placeholder="Paste the job description here... (Max 2000 words for best AI analysis)"
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-violet-200 focus:border-violet-400 transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
              <div className={`absolute bottom-3 right-4 text-sm font-medium ${
                wordCount > 2000 ? 'text-rose-600' : 
                wordCount > 1500 ? 'text-amber-600' : 'text-gray-500'
              }`}>
                {wordCount}/2000 words
              </div>
            </div>
            {errors.jobDescription && (
              <p className="mt-2 text-sm text-rose-600">{errors.jobDescription.message as string}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none text-lg"
          >
            {loading ? (
              <>
                <Upload className="animate-spin h-6 w-6 mr-3 inline" />
                Analyzing Your Resume...
              </>
            ) : (
              <>
                <Zap className="h-6 w-6 mr-3 inline" />
                Analyze with AI
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}