'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Analysis } from '@/lib/types';
import { Navbar } from '@/components/layout/navbar';
import { GrowthScore } from '@/components/dashboard/growth-score';
import { MetricCard } from '@/components/dashboard/metric-card';
import { ProblemList } from '@/components/dashboard/problem-list';
import { ExperimentList } from '@/components/experiments/experiment-list';
import { DownloadButton } from '@/components/report/download-button';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatDate, truncateFileName } from '@/lib/utils';
import Link from 'next/link';

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setEmail(user.email || '');

      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setAnalysis(data as Analysis);
      }
      setLoading(false);
    }
    load();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1EFE8]">
        <Navbar email="" />
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#F1EFE8]">
        <Navbar email={email} />
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <p className="text-[14px] text-[#2C2C2A] mb-2">Analysis not found</p>
          <p className="text-[12px] text-[#5F5E5A] mb-4">It may have been deleted.</p>
          <Link href="/dashboard"><Button variant="secondary">Back to dashboard</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <Navbar email={email} />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-[12px] text-[#185FA5] hover:underline">
              ← Back to dashboard
            </Link>
            <h1 className="text-[18px] font-medium text-[#2C2C2A] mt-1">
              {truncateFileName(analysis.file_name)}
            </h1>
            <p className="text-[12px] text-[#5F5E5A]">{formatDate(analysis.created_at)}</p>
          </div>
          <DownloadButton analysisId={analysis.id} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GrowthScore score={analysis.growth_score} />
          <div className="sm:col-span-2 grid grid-cols-2 gap-3">
            <MetricCard label="Activation rate" value={analysis.metrics.activation_rate} benchmarkKey="activation_rate" />
            <MetricCard label="Conversion rate" value={analysis.metrics.conversion_rate} benchmarkKey="conversion_rate" />
            <MetricCard label="Retention rate" value={analysis.metrics.retention_rate} benchmarkKey="retention_rate" />
            <MetricCard label="Churn rate" value={analysis.metrics.churn_rate} benchmarkKey="churn_rate" invertComparison />
          </div>
        </div>

        <ProblemList problems={analysis.problems} />
        <ExperimentList experiments={analysis.experiments} />
      </div>
    </div>
  );
}
