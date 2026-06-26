'use client';

import { useState } from 'react';
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
import { useUpload } from '@/hooks/use-upload';

export default function DashboardPage() {
  const [showUpload, setShowUpload] = useState(false);
  const { step, progress, error, analysis, upload, reset } = useUpload();

  const isUploading = step !== 'idle' && step !== 'completed' && step !== 'error';
  const showUploadView = showUpload || !analysis;

  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <Navbar />

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

        {!isUploading && step !== 'error' && showUploadView && !analysis && (
          <div className="max-w-md mx-auto py-12">
            <EmptyState />
            <div className="mt-6">
              <CSVUploader onUpload={upload} />
            </div>
          </div>
        )}

        {!isUploading && step !== 'error' && showUploadView && analysis && (
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

        {!isUploading && step !== 'error' && !showUploadView && analysis && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-[18px] font-medium text-[#2C2C2A]">Dashboard</h1>
              <div className="flex gap-2">
                <DownloadButton analysis={analysis} />
                <Button onClick={() => { setShowUpload(true); reset(); }}>Upload new CSV</Button>
              </div>
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
        )}
      </div>
    </div>
  );
}
