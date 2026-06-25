import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { parseCSV } from '@/lib/csv-parser';
import { calculateMetrics, calculateGrowthScore } from '@/lib/metrics';
import { UPLOAD_LIMITS } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    if (file.size > UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'This file is over 5MB. Try a shorter date range.' }, { status: 400 });
    }

    const text = await file.text();
    const { data, errors } = parseCSV(text, file.name);

    if (errors.length > 0 && data.length === 0) {
      return NextResponse.json({ error: errors[0] }, { status: 400 });
    }

    const metrics = calculateMetrics(data);
    const growthScore = calculateGrowthScore(metrics);

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    return NextResponse.json({
      metrics,
      growthScore,
      parsedData: data,
      fileName: file.name,
      rowCount: data.length,
      role: profile?.role || 'other',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to analyze file' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    const { data, error } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        file_name: body.fileName,
        row_count: body.rowCount,
        growth_score: body.growthScore,
        metrics: body.metrics,
        problems: body.problems,
        experiments: body.experiments,
        raw_data: body.parsedData.slice(-500),
        status: 'completed',
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: 'Failed to save analysis' }, { status: 500 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to save analysis' }, { status: 500 });
  }
}
