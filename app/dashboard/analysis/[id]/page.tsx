'use client';

import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-[14px] text-[#2C2C2A] mb-2">Analysis not found</p>
        <p className="text-[12px] text-[#5F5E5A] mb-4">Upload a new CSV from the dashboard.</p>
        <Link href="/dashboard"><Button variant="secondary">Back to dashboard</Button></Link>
      </div>
    </div>
  );
}
