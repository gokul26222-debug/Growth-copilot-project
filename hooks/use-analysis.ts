'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Analysis } from '@/lib/types';

export function useAnalyses() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const fetchAnalyses = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch analyses:', error.message);
      setAnalyses([]);
    } else {
      setAnalyses((data as Analysis[]) || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  return { analyses, loading, refetch: fetchAnalyses };
}

export function useAnalysis(id: string) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Failed to fetch analysis:', error.message);
        setAnalysis(null);
      } else {
        setAnalysis(data as Analysis);
      }
      setLoading(false);
    }
    load();
  }, [id, supabase]);

  return { analysis, loading };
}
