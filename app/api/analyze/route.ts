import { NextRequest, NextResponse } from 'next/server';
import { parseCSV } from '@/lib/csv-parser';
import { calculateMetrics, calculateGrowthScore } from '@/lib/metrics';
import { UPLOAD_LIMITS } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
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

    return NextResponse.json({
      metrics,
      growthScore,
      parsedData: data,
      fileName: file.name,
      rowCount: data.length,
      role: 'founder',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to analyze file' }, { status: 500 });
  }
}
