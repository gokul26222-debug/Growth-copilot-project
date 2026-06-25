import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { generateAIResponse } from '@/lib/openai';
import { checkRateLimit, logAction } from '@/lib/rate-limiter';
import { Metrics, Problem } from '@/lib/types';
import { BENCHMARKS } from '@/lib/constants';

interface InsightsResponse {
  problems: Problem[];
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rateLimit = await checkRateLimit(user.id, 'insights', 5, 3600000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Analysis limit reached. Please wait.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } }
      );
    }

    const { metrics, role } = await request.json() as { metrics: Metrics; role: string };

    const systemPrompt = `You are a senior growth analyst at a B2B SaaS company.
Given product metrics, identify the 3 biggest growth problems.
Be specific. Use exact numbers. Compare to SaaS benchmarks.
Respond ONLY with valid JSON.`;

    const userPrompt = `Here are our current SaaS metrics:
- Activation Rate: ${metrics.activation_rate}% (benchmark: ${BENCHMARKS.activation_rate}%)
- Conversion Rate: ${metrics.conversion_rate}% (benchmark: ${BENCHMARKS.conversion_rate}%)
- Retention Rate: ${metrics.retention_rate}% (benchmark: ${BENCHMARKS.retention_rate}%)
- Churn Rate: ${metrics.churn_rate}% (benchmark: ${BENCHMARKS.churn_rate}%)
- Growth Rate: ${metrics.growth_rate}% (benchmark: ${BENCHMARKS.growth_rate}%)

User role: ${role}
Identify the 3 biggest problems. Rank by business impact.

Return JSON: { "problems": [{ "title": string, "description": string, "severity": "critical"|"warning"|"info", "metric": string }] }`;

    const result = await generateAIResponse<InsightsResponse>(systemPrompt, userPrompt);
    await logAction(user.id, 'insights', { metrics });

    return NextResponse.json({ problems: result.problems || [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI service unavailable';
    if (message.includes('timeout') || message.includes('abort')) {
      return NextResponse.json({ error: 'Analysis took too long. Please try again.' }, { status: 504 });
    }
    return NextResponse.json({ error: 'Our AI is temporarily unavailable. Try again in a minute.' }, { status: 500 });
  }
}
