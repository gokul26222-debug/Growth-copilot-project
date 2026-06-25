'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const roles = [
  { value: 'product_manager', label: 'Product manager' },
  { value: 'growth_manager', label: 'Growth manager' },
  { value: 'founder', label: 'Founder' },
  { value: 'other', label: 'Other' },
] as const;

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!selectedRole) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    await supabase.from('profiles').update({
      role: selectedRole,
      onboarded: true,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id);

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1EFE8] px-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-[18px] font-medium text-[#2C2C2A] mb-2 text-center">
          What&apos;s your role?
        </h1>
        <p className="text-[12px] text-[#5F5E5A] mb-6 text-center">
          This helps us tailor the analysis to your needs.
        </p>

        <div className="space-y-2 mb-6">
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => setSelectedRole(role.value)}
              className={cn(
                'w-full h-10 rounded-lg border text-[13px] text-left px-4 transition-colors',
                selectedRole === role.value
                  ? 'border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]'
                  : 'border-[#D3D1C7] text-[#2C2C2A] hover:bg-[#F1EFE8]'
              )}
            >
              {role.label}
            </button>
          ))}
        </div>

        <Button onClick={handleSubmit} disabled={!selectedRole || loading} className="w-full">
          {loading ? 'Saving...' : 'Continue'}
        </Button>
      </Card>
    </div>
  );
}
