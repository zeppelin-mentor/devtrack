type SendVerificationEmailParams = {
  to: string;
  verificationUrl: string;
};

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || 'DevTrack <noreply@email.zeppelinlabs.digital>';

  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY.');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend email failed: ${details}`);
  }
}

export async function sendVerificationEmail({ to, verificationUrl }: SendVerificationEmailParams) {
  return sendEmail({
    to,
    subject: 'Verify your DevTrack email',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
          <h1 style="font-size: 24px; margin-bottom: 12px;">Verify your email</h1>
          <p style="font-size: 16px; line-height: 1.6;">Confirm this email address to finish creating your DevTrack account.</p>
          <a href="${verificationUrl}" style="display: inline-block; margin: 20px 0; padding: 12px 18px; background: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700;">Verify email</a>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">If the button does not work, paste this link into your browser:</p>
          <p style="font-size: 14px; line-height: 1.6; word-break: break-all; color: #475569;">${verificationUrl}</p>
          <p style="font-size: 14px; line-height: 1.6; color: #64748b;">If you did not create a DevTrack account, you can ignore this email.</p>
        </div>
      `,
  });
}

export async function sendPasswordResetEmail({ to, verificationUrl }: SendVerificationEmailParams) {
  return sendEmail({
    to,
    subject: 'Reset your DevTrack password',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
          <h1 style="font-size: 24px; margin-bottom: 12px;">Reset your password</h1>
          <p style="font-size: 16px; line-height: 1.6;">Use this secure link to set a new password for your DevTrack account.</p>
          <a href="${verificationUrl}" style="display: inline-block; margin: 20px 0; padding: 12px 18px; background: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700;">Reset password</a>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">If the button does not work, paste this link into your browser:</p>
          <p style="font-size: 14px; line-height: 1.6; word-break: break-all; color: #475569;">${verificationUrl}</p>
          <p style="font-size: 14px; line-height: 1.6; color: #64748b;">If you did not request a password reset, you can ignore this email.</p>
        </div>
      `,
  });
}
