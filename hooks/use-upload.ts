'use client';

import { useState, useCallback } from 'react';
import { UploadStep, Analysis } from '@/lib/types';

export function useUpload() {
  const [step, setStep] = useState<UploadStep>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const upload = useCallback(async (file: File | 'sample') => {
    setStep('uploading');
    setProgress(10);
    setError(null);

    try {
      const formData = new FormData();
      if (file === 'sample') {
        const res = await fetch('/sample-data.csv');
        const blob = await res.blob();
        formData.append('file', new File([blob], 'sample-data.csv', { type: 'text/csv' }));
      } else {
        formData.append('file', file);
      }

      setStep('parsing');
      setProgress(20);

      const analyzeRes = await fetch('/api/analyze', { method: 'POST', body: formData });
      if (!analyzeRes.ok) {
        const err = await analyzeRes.json();
        throw new Error(err.error || 'Failed to analyze file');
      }
      const analyzeData = await analyzeRes.json();

      setStep('calculating');
      setProgress(40);

      setStep('analyzing');
      setProgress(50);

      const insightsRes = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics: analyzeData.metrics, role: analyzeData.role }),
      });
      if (!insightsRes.ok) {
        const err = await insightsRes.json();
        throw new Error(err.error || 'Failed to get insights');
      }
      const insightsData = await insightsRes.json();

      setStep('generating');
      setProgress(70);

      const expRes = await fetch('/api/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problems: insightsData.problems, metrics: analyzeData.metrics }),
      });
      if (!expRes.ok) {
        const err = await expRes.json();
        throw new Error(err.error || 'Failed to generate experiments');
      }
      const expData = await expRes.json();

      setStep('saving');
      setProgress(90);

      const saveRes = await fetch('/api/analyze', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...analyzeData,
          problems: insightsData.problems,
          experiments: expData.experiments,
        }),
      });
      if (!saveRes.ok) {
        const err = await saveRes.json();
        throw new Error(err.error || 'Failed to save analysis');
      }
      const savedAnalysis = await saveRes.json();

      setAnalysis(savedAnalysis);
      setStep('completed');
      setProgress(100);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      setStep('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStep('idle');
    setProgress(0);
    setError(null);
    setAnalysis(null);
  }, []);

  return { step, progress, error, analysis, upload, reset };
}
