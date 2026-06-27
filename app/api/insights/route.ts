import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/openai';
import { generateFallbackProblems } from '@/lib/fallback-analysis';
import { Metrics, Problem } from '@/lib/types';
import { BENCHMARKS } from '@/lib/constants';

interface InsightsResponse {
  problems: Problem[];
}

export async function POST(request: NextRequest) {
  try {
    const { metrics, role } = await request.json() as { metrics: Metrics; role: string };

    if (!metrics || typeof metrics.activation_rate !== 'number') {
      return NextResponse.json({ error: 'Invalid metrics data' }, { status: 400 });
    }

    // Try AI first, fall back to rule-based analysis
    try {
      const systemPrompt = `You are a senior growth analyst at a B2B SaaS company.
Given product metrics, identify the 3 biggest growth problems.
Be specific. Use exact numbers. Compare to SaaS benchmarks.
Respond ONLY with valid JSON, no markdown.`;

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

      if (result.problems && Array.isArray(result.problems) && result.problems.length > 0) {
        return NextResponse.json({ problems: result.problems });
      }
    } catch (err) {
      console.error('[Insights] AI failed, using fallback:', err instanceof Error ? err.message : err);
    }

    // Fallback: rule-based analysis
    const problems = generateFallbackProblems(metrics);
    return NextResponse.json({ problems });
  } catch (err) {
    console.error('[Insights] Unexpected error:', err);
    return NextResponse.json({ error: 'Failed to analyze metrics' }, { status: 500 });
  }
}
