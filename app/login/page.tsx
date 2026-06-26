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

  const handleForgotPassword = async () => {
    if (!email) {
      toast('Enter your email first, then click "Forgot password".', 'error');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      });
      if (error) {
        toast(error.message, 'error');
      } else {
        toast('Password reset link sent. Check your email.', 'success');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <h1 className="text-[18px] font-medium text-[#2C2C2A] mb-6 text-center">
        {isLogin ? 'Welcome back' : 'Create your account'}
      </h1>

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

      {isLogin && (
        <button
          onClick={handleForgotPassword}
          className="block w-full text-center text-[12px] text-[#185FA5] hover:underline mt-3"
        >
          Forgot password?
        </button>
      )}

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
