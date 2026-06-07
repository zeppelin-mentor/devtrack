import { supabase } from './client';
import { validateForgotPasswordInput, validateLoginInput, validateResetPasswordInput } from '@/lib/authValidation';

export async function signUp(email: string, password: string, confirmPassword: string) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, confirmPassword }),
  });

  const payload = await response.json();

  if (!response.ok) {
    return { message: '', error: { message: payload.error || 'Failed to create account' } };
  }

  return { message: payload.message as string, error: null };
}

export async function signIn(email: string, password: string) {
  const parsed = validateLoginInput(email, password);

  if (!parsed.success) {
    return {
      data: { user: null, session: null },
      error: { message: parsed.error.issues[0]?.message || 'Invalid login details' },
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { data, error };
  }

  if (data.user && !data.user.email_confirmed_at) {
    await supabase.auth.signOut();
    return {
      data: { user: null, session: null },
      error: { message: 'Please verify your email before logging in.' },
    };
  }

  return { data, error };
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
  return { data, error };
}

export async function signInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function requestPasswordReset(email: string) {
  const parsed = validateForgotPasswordInput(email);

  if (!parsed.success) {
    return { message: '', error: { message: parsed.error.issues[0]?.message || 'Enter a valid email address' } };
  }

  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: parsed.data.email }),
  });

  const payload = await response.json();

  if (!response.ok) {
    return { message: '', error: { message: payload.error || 'Failed to send reset email' } };
  }

  return { message: payload.message as string, error: null };
}

export async function completePasswordReset(password: string, confirmPassword: string) {
  const parsed = validateResetPasswordInput(password, confirmPassword);

  if (!parsed.success) {
    return { user: null, error: { message: parsed.error.issues[0]?.message || 'Invalid password' } };
  }

  const { data, error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { user: null, error };
  }

  await supabase.auth.signOut();
  return { user: data.user, error: null };
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

// Profile management
export async function updateUserProfile(updates: { avatar_url?: string }) {
  const { data, error } = await supabase.auth.updateUser({
    data: updates
  });
  
  if (error) throw error;
  return data.user;
}

export async function updateUserPassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });
  
  if (error) throw error;
  return data.user;
}

export async function uploadProfilePhoto(file: File, userId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Upload file to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(filePath);

  // Update user metadata
  await updateUserProfile({ avatar_url: publicUrl });

  return publicUrl;
}
