'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { completePasswordReset } from '@/lib/supabase/auth';
import { validateResetPasswordInput } from '@/lib/authValidation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const prepareSession = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const tokenHash = url.searchParams.get('token_hash');
        const type = url.searchParams.get('type');
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (tokenHash && type === 'recovery') {
          const { error } = await supabase.auth.verifyOtp({
            type: 'recovery',
            token_hash: tokenHash,
          });

          if (error) {
            setError('This password reset link is invalid or has expired.');
            return;
          }

          window.history.replaceState(null, '', '/auth/reset-password');
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setError('This password reset link is invalid or has expired.');
            return;
          }
          window.history.replaceState(null, '', '/auth/reset-password');
        }

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            setError('This password reset link is invalid or has expired.');
            return;
          }

          window.history.replaceState(null, '', '/auth/reset-password');
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setError('Open the password reset link from your email before setting a new password.');
          return;
        }

        setSessionReady(true);
      } catch {
        setError('Unable to validate this password reset link.');
      } finally {
        setCheckingSession(false);
      }
    };

    prepareSession();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const parsed = validateResetPasswordInput(password, confirmPassword);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Invalid password');
      return;
    }

    setLoading(true);

    try {
      const { error } = await completePasswordReset(password, confirmPassword);

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess('Password updated. You can now log in with your new password.');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => router.push('/auth/login'), 1200);
    } catch {
      setError('Unable to update password right now.');
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
          <h1 className="mb-2 text-4xl font-bold text-slate-900">Set New Password</h1>
          <p className="text-slate-600">Choose a strong password for your account.</p>
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

          {checkingSession ? (
            <div className="text-center text-slate-600">Checking reset link...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label className="mb-2 block text-sm font-semibold text-slate-700">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white/50 py-3.5 pl-12 pr-12 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                    placeholder="New secure password"
                    required
                    disabled={!sessionReady || Boolean(success)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  At least 10 characters with uppercase, lowercase, number, and symbol
                </p>
              </div>

              <div className="group">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white/50 py-3.5 pl-12 pr-12 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                    placeholder="Confirm new password"
                    required
                    disabled={!sessionReady || Boolean(success)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !sessionReady || Boolean(success)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3.5 text-lg font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-indigo-800 hover:shadow-xl disabled:opacity-50"
              >
                {loading ? 'Updating password...' : 'Update Password'}
                {!loading && <ArrowRight className="h-5 w-5" />}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-slate-600">
            Back to{' '}
            <Link href="/auth/login" className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
