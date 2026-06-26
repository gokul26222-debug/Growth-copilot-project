'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { Suspense } from 'react';

function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    if (errorParam) {
      toast(errorDescription || 'Authentication failed. Please try again.', 'error');
    }
  }, [searchParams, toast]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/dashboard');
    });
  }, [supabase, router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast(error.message === 'Invalid login credentials'
            ? 'Email or password is incorrect. Try again or reset your password.'
            : error.message, 'error');
          return;
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) {
          toast(error.message.includes('already registered')
            ? 'This email is already registered. Try logging in instead.'
            : error.message, 'error');
          return;
        }
        toast('Check your email to confirm your account.', 'success');
        return;
      }
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) {
      toast('Failed to connect to Google. Please try again.', 'error');
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <h1 className="text-[18px] font-medium text-[#2C2C2A] mb-6 text-center">
        {isLogin ? 'Welcome back' : 'Create your account'}
      </h1>

      <button
        onClick={handleGoogleAuth}
        className="w-full h-10 rounded-lg border border-[#D3D1C7] text-[13px] text-[#2C2C2A] hover:bg-[#F1EFE8] transition-colors flex items-center justify-center gap-2 mb-4"
      >
        <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-[#D3D1C7]" />
        <span className="text-[11px] text-[#5F5E5A]">or</span>
        <div className="flex-1 h-px bg-[#D3D1C7]" />
      </div>

      <form onSubmit={handleEmailAuth} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full h-9 px-3 rounded-lg border border-[#D3D1C7] text-[13px] text-[#2C2C2A] placeholder-[#5F5E5A] focus:outline-none focus:border-[#185FA5]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full h-9 px-3 rounded-lg border border-[#D3D1C7] text-[13px] text-[#2C2C2A] placeholder-[#5F5E5A] focus:outline-none focus:border-[#185FA5]"
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Loading...' : isLogin ? 'Log in' : 'Sign up'}
        </Button>
      </form>

      <p className="text-[12px] text-[#5F5E5A] text-center mt-4">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-[#185FA5] hover:underline"
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1EFE8] px-4">
      <Suspense fallback={
        <Card className="w-full max-w-sm">
          <div className="h-64 flex items-center justify-center text-[13px] text-[#5F5E5A]">Loading...</div>
        </Card>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
