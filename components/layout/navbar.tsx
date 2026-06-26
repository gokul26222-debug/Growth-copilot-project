'use client';

import { useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function Navbar({ email }: { email?: string }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="border-b border-[#D3D1C7] bg-white">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="text-[14px] font-medium text-[#2C2C2A]">Growth copilot</span>
        {email && (
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-[#5F5E5A] hidden sm:block">{email}</span>
            <Button variant="secondary" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
