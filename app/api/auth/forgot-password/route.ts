import { NextRequest, NextResponse } from 'next/server';
import { forgotPasswordSchema } from '@/lib/authValidation';
import { checkRateLimit } from '@/lib/server/rateLimit';
import { sendPasswordResetEmail } from '@/lib/server/resend';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { getSiteUrl } from '@/lib/server/siteUrl';

function getClientIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Enter a valid email address' },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);
  const emailLimit = checkRateLimit(`forgot-password:email:${parsed.data.email}`, 3, 15 * 60 * 1000);
  const ipLimit = checkRateLimit(`forgot-password:ip:${ip}`, 10, 15 * 60 * 1000);

  if (!emailLimit.allowed || !ipLimit.allowed) {
    return NextResponse.json(
      {
        error: `Too many reset attempts. Try again in ${Math.max(
          emailLimit.retryAfterSeconds,
          ipLimit.retryAfterSeconds
        )} seconds.`,
      },
      { status: 429 }
    );
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const origin = getSiteUrl(request);
    const redirectTo = `${origin}/auth/reset-password`;

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: parsed.data.email,
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error('Supabase password recovery link error:', error.message);
      const message = error.message.toLowerCase().includes('not found')
        ? 'No account was found with this email address.'
        : 'Unable to create a reset link right now. Please try again.';

      return NextResponse.json({ error: message }, { status: 400 });
    }

    const tokenHash = data.properties?.hashed_token;

    if (!tokenHash) {
      console.error('Supabase did not return a password recovery token hash.');
      return NextResponse.json(
        { error: 'Unable to create a reset link right now. Please try again.' },
        { status: 500 }
      );
    }

    const resetUrl = `${origin}/auth/reset-password?token_hash=${encodeURIComponent(tokenHash)}&type=recovery`;

    await sendPasswordResetEmail({
      to: parsed.data.email,
      verificationUrl: resetUrl,
    });

    return NextResponse.json({ message: 'Check your email for a password reset link.' });
  } catch (error) {
    console.error('Password reset email error:', error);
    return NextResponse.json(
      { error: 'Unable to send password reset email right now.' },
      { status: 500 }
    );
  }
}
