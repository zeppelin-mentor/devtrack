'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Mail } from 'lucide-react';
import { requestPasswordReset } from '@/lib/supabase/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { message, error } = await requestPasswordReset(email);

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(message || 'Check your email for a password reset link.');
      setEmail('');
    } catch {
      setError('Unable to send password reset email right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-indigo-400 opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-400 opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-6 inline-block">
            <Image
              src="/horizantal-logo-devtrack.png"
              alt="DevTrack"
              width={200}
              height={50}
              className="mx-auto h-12 w-auto"
            />
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-slate-900">Reset Password</h1>
          <p className="text-slate-600">Enter your email and we will send a secure reset link.</p>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white/50 py-3.5 pl-12 pr-4 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3.5 text-lg font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-indigo-800 hover:shadow-xl disabled:opacity-50"
            >
              {loading ? 'Sending reset link...' : 'Send Reset Link'}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-600">
            Remembered your password?{' '}
            <Link href="/auth/login" className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
