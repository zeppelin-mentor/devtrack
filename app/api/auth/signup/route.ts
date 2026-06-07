import { NextRequest, NextResponse } from 'next/server';
import { signupSchema } from '@/lib/authValidation';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { checkRateLimit } from '@/lib/server/rateLimit';
import { sendVerificationEmail } from '@/lib/server/resend';
import { getSiteUrl } from '@/lib/server/siteUrl';

function getClientIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Invalid signup details' },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);
  const emailLimit = checkRateLimit(`signup:email:${parsed.data.email}`, 3, 15 * 60 * 1000);
  const ipLimit = checkRateLimit(`signup:ip:${ip}`, 10, 15 * 60 * 1000);

  if (!emailLimit.allowed || !ipLimit.allowed) {
    return NextResponse.json(
      {
        error: `Too many signup attempts. Try again in ${Math.max(
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
    const redirectTo = `${origin}/auth/login?verified=1`;

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error('Supabase verification link error:', error.message);
      const message = error.message.toLowerCase().includes('already been registered')
        ? 'An account with this email already exists. Please log in instead.'
        : 'Unable to create this account right now. Please try again.';

      return NextResponse.json({ error: message }, { status: 400 });
    }

    const verificationUrl = data.properties?.action_link;

    if (!verificationUrl) {
      console.error('Supabase did not return a verification action link.');
      return NextResponse.json(
        { error: 'Unable to create a verification link right now. Please try again.' },
        { status: 500 }
      );
    }

    await sendVerificationEmail({
      to: parsed.data.email,
      verificationUrl,
    });

    return NextResponse.json({ message: 'Check your email for a verification link before logging in.' });
  } catch (error) {
    console.error('Signup verification email error:', error);
    return NextResponse.json(
      { error: 'Unable to send verification email right now.' },
      { status: 500 }
    );
  }
}
