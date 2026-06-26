'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Analysis } from '@/lib/types';

interface DownloadButtonProps {
  analysis: Analysis;
}

export function DownloadButton({ analysis }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysis),
      });

      if (!res.ok) {
        toast('Failed to generate report. Please try again.', 'error');
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `growth-report-${new Date().toISOString().slice(0, 10)}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast('Failed to generate report. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={loading} variant="secondary">
      {loading ? 'Generating...' : 'Download report'}
    </Button>
  );
}
