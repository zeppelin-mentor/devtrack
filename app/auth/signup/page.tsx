'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { signUp, signInWithGoogle, signInWithGitHub } from '@/lib/supabase/auth';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUp(email, password);
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Failed to sign in with Google');
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setError('');
      const { error } = await signInWithGitHub();
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Failed to sign in with GitHub');
    }
  };

  const benefits = [
    'Track unlimited projects',
    'Export professional resumes',
    'Manage multiple accounts',
    'Free forever',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Benefits */}
          <div className="hidden md:block animate-fade-in-up">
            <Link href="/" className="inline-block mb-8">
              <Image
                src="/horizantal-logo-devtrack.png"
                alt="DevTrack"
                width={200}
                height={50}
                className="h-12 w-auto hover:scale-105 transition-transform"
              />
            </Link>
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              Start Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Developer Journey
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Join thousands of developers managing their projects and building impressive portfolios.
            </p>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-lg text-slate-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="animate-fade-in-up animation-delay-200">
            {/* Mobile Logo */}
            <div className="md:hidden text-center mb-6">
              <Link href="/" className="inline-block">
                <Image
                  src="/horizantal-logo-devtrack.png"
                  alt="DevTrack"
                  width={200}
                  height={50}
                  className="h-12 w-auto mx-auto hover:scale-105 transition-transform"
                />
              </Link>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
                <p className="text-slate-600">Get started in less than 2 minutes</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm flex items-center gap-2 animate-fade-in-down">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-white/50"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-white/50"
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters</p>
                </div>

                {/* Confirm Password Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-white/50"
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" required className="w-4 h-4 mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                    I agree to the{' '}
                    <Link href="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3.5 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl font-semibold text-lg group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">or continue with</span>
                </div>
              </div>

              {/* Social Signup */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all font-medium text-slate-700"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={handleGitHubSignIn}
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all font-medium text-slate-700"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>

              {/* Login Link */}
              <p className="text-center mt-6 text-slate-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors inline-flex items-center gap-1 group">
                  Login
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <Link href="/" className="text-sm text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1">
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
