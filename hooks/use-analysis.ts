'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Analysis } from '@/lib/types';

export function useAnalyses() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchAnalyses = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('analyses')
      .select('*')
      .order('created_at', { ascending: false });

    setAnalyses((data as Analysis[]) || []);
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
  const supabase = createClient();

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .single();

      setAnalysis(data as Analysis | null);
      setLoading(false);
    }
    fetch();
  }, [id, supabase]);

  return { analysis, loading };
}
