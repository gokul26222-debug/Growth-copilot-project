'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Analysis } from '@/lib/types';
import { Navbar } from '@/components/layout/navbar';
import { CSVUploader } from '@/components/upload/csv-uploader';
import { UploadProgress } from '@/components/upload/upload-progress';
import { GrowthScore } from '@/components/dashboard/growth-score';
import { MetricCard } from '@/components/dashboard/metric-card';
import { ProblemList } from '@/components/dashboard/problem-list';
import { ExperimentList } from '@/components/experiments/experiment-list';
import { EmptyState } from '@/components/dashboard/empty-state';
import { DownloadButton } from '@/components/report/download-button';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUpload } from '@/hooks/use-upload';
import { formatDate, truncateFileName, getScoreColor } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const [email, setEmail] = useState<string>('');
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const { step, progress, error, analysis: newAnalysis, upload, reset } = useUpload();
  const supabase = useMemo(() => createClient(), []);

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setEmail(user.email || '');

    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setAnalyses((data as Analysis[]) || []);
    }
    setLoadingData(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (step === 'completed') {
      fetchData();
      setTimeout(() => { setShowUpload(false); reset(); }, 1500);
    }
  }, [step, fetchData, reset]);

  const latest = newAnalysis || analyses[0];
  const isUploading = step !== 'idle' && step !== 'completed' && step !== 'error';
  const showUploadView = showUpload || analyses.length === 0;

  if (loadingData) {
    return (
      <div className="min-h-screen bg-[#F1EFE8]">
        <Navbar email="" />
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-20" />)}
          </div>
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <Navbar email={email} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {(isUploading || step === 'error') && (
          <div className="py-16">
            <UploadProgress step={step} progress={progress} error={error} />
            {step === 'error' && (
              <div className="text-center mt-4">
                <Button variant="secondary" onClick={reset}>Try again</Button>
              </div>
            )}
          </div>
        )}

        {!isUploading && step !== 'error' && showUploadView && !latest && (
          <div className="max-w-md mx-auto py-12">
            <EmptyState />
            <div className="mt-6">
              <CSVUploader onUpload={upload} />
            </div>
          </div>
        )}

        {!isUploading && step !== 'error' && showUploadView && latest && (
          <div className="max-w-md mx-auto py-12">
            <CSVUploader onUpload={upload} />
            <button
              onClick={() => setShowUpload(false)}
              className="block mx-auto mt-4 text-[12px] text-[#5F5E5A] hover:underline"
            >
              Cancel
            </button>
          </div>
        )}

        {!isUploading && step !== 'error' && !showUploadView && latest && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-[18px] font-medium text-[#2C2C2A]">Dashboard</h1>
              <div className="flex gap-2">
                <DownloadButton analysisId={latest.id} />
                <Button onClick={() => setShowUpload(true)}>Upload new CSV</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GrowthScore score={latest.growth_score} />
              <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                <MetricCard label="Activation rate" value={latest.metrics.activation_rate} benchmarkKey="activation_rate" />
                <MetricCard label="Conversion rate" value={latest.metrics.conversion_rate} benchmarkKey="conversion_rate" />
                <MetricCard label="Retention rate" value={latest.metrics.retention_rate} benchmarkKey="retention_rate" />
                <MetricCard label="Churn rate" value={latest.metrics.churn_rate} benchmarkKey="churn_rate" invertComparison />
              </div>
            </div>

            <ProblemList problems={latest.problems} />
            <ExperimentList experiments={latest.experiments} />

            {analyses.length > 1 && (
              <div>
                <h2 className="text-[14px] font-medium text-[#2C2C2A] mb-3">Recent analyses</h2>
                <div className="space-y-2">
                  {analyses.slice(1).map((a) => {
                    const scoreColor = getScoreColor(a.growth_score);
                    return (
                      <Card key={a.id} padding="sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`text-[13px] font-medium px-2 py-0.5 rounded-lg ${scoreColor.bg} ${scoreColor.text}`}>
                              {a.growth_score}
                            </span>
                            <span className="text-[13px] text-[#2C2C2A]">{truncateFileName(a.file_name)}</span>
                            <span className="text-[11px] text-[#5F5E5A]">{formatDate(a.created_at)}</span>
                          </div>
                          <Link href={`/dashboard/analysis/${a.id}`} className="text-[12px] text-[#185FA5] hover:underline">
                            View
                          </Link>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
