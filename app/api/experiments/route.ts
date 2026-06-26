import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/openai';
import { Metrics, Problem, Experiment } from '@/lib/types';

interface ExperimentsResponse {
  experiments: Experiment[];
}

export async function POST(request: NextRequest) {
  try {
    const { problems, metrics } = await request.json() as { problems: Problem[]; metrics: Metrics };

    const systemPrompt = `You are a senior growth PM. Given growth problems,
generate exactly 5 prioritized experiments. Each must be specific, actionable, and measurable.
Respond ONLY with valid JSON.`;

    const problemsList = problems.map((p, i) => `${i + 1}. ${p.title}: ${p.description}`).join('\n');

    const userPrompt = `Our biggest problems:
${problemsList}

Current metrics:
- Activation: ${metrics.activation_rate}%
- Conversion: ${metrics.conversion_rate}%
- Retention: ${metrics.retention_rate}%
- Churn: ${metrics.churn_rate}%
- Growth: ${metrics.growth_rate}%

Generate 5 experiments. Rank by impact-to-effort ratio.

Return JSON: { "experiments": [{ "title": string, "problem": string, "hypothesis": string, "expected_impact": "high"|"medium"|"low", "difficulty": "easy"|"medium"|"hard", "priority": "P0"|"P1"|"P2", "metric_to_track": string, "owner": "PM"|"Engineering"|"Design"|"Marketing", "timeline": string }] }`;

    const result = await generateAIResponse<ExperimentsResponse>(systemPrompt, userPrompt);

    return NextResponse.json({ experiments: result.experiments || [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI service unavailable';
    if (message.includes('timeout') || message.includes('abort')) {
      return NextResponse.json({ error: 'Analysis took too long. Please try again.' }, { status: 504 });
    }
    return NextResponse.json({ error: 'Our AI is temporarily unavailable. Try again in a minute.' }, { status: 500 });
  }
}
