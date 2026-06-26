import { NextRequest, NextResponse } from 'next/server';
import { Analysis } from '@/lib/types';
import { getScoreColor, formatPercent } from '@/lib/utils';
import { BENCHMARKS } from '@/lib/constants';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: NextRequest) {
  try {
    const analysis = await request.json() as Analysis;

    if (!analysis.metrics || !analysis.problems || !analysis.experiments) {
      return NextResponse.json({ error: 'Invalid analysis data' }, { status: 400 });
    }

    const scoreInfo = getScoreColor(analysis.growth_score);
    const html = generateReportHTML(analysis, scoreInfo.label);

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="growth-report-${new Date().toISOString().slice(0, 10)}.html"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

function generateReportHTML(analysis: Analysis, scoreLabel: string): string {
  const metricsRows = [
    ['Activation rate', formatPercent(analysis.metrics.activation_rate), formatPercent(BENCHMARKS.activation_rate)],
    ['Conversion rate', formatPercent(analysis.metrics.conversion_rate), formatPercent(BENCHMARKS.conversion_rate)],
    ['Retention rate', formatPercent(analysis.metrics.retention_rate), formatPercent(BENCHMARKS.retention_rate)],
    ['Churn rate', formatPercent(analysis.metrics.churn_rate), formatPercent(BENCHMARKS.churn_rate)],
    ['Growth rate', formatPercent(analysis.metrics.growth_rate), formatPercent(BENCHMARKS.growth_rate)],
  ];

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Growth Report</title>
<style>
body { font-family: Inter, system-ui, sans-serif; color: #2C2C2A; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
h1 { font-size: 28px; font-weight: 500; }
h2 { font-size: 18px; font-weight: 500; margin-top: 40px; }
.score { font-size: 48px; font-weight: 500; }
.label { color: #5F5E5A; font-size: 13px; }
table { width: 100%; border-collapse: collapse; margin: 16px 0; }
th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #D3D1C7; font-size: 13px; }
th { color: #5F5E5A; font-weight: 400; }
.card { border: 1px solid #D3D1C7; border-radius: 12px; padding: 16px; margin: 8px 0; }
.severity-critical { color: #A32D2D; }
.severity-warning { color: #BA7517; }
.severity-info { color: #185FA5; }
.footer { margin-top: 60px; text-align: center; color: #5F5E5A; font-size: 11px; }
</style>
</head>
<body>
<h1>Growth Report</h1>
<p class="label">Generated ${escapeHtml(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))}</p>

<div style="text-align: center; margin: 40px 0;">
  <div class="score">${Number(analysis.growth_score)}/100</div>
  <div class="label">${escapeHtml(scoreLabel)}</div>
</div>

<h2>Metrics summary</h2>
<table>
<tr><th>Metric</th><th>Current</th><th>Benchmark</th></tr>
${metricsRows.map(([m, v, b]) => `<tr><td>${escapeHtml(String(m))}</td><td>${escapeHtml(String(v))}</td><td>${escapeHtml(String(b))}</td></tr>`).join('\n')}
</table>

<h2>Biggest problems</h2>
${(analysis.problems || []).map((p, i) => `
<div class="card">
  <strong>${i + 1}. ${escapeHtml(p.title)}</strong> <span class="severity-${escapeHtml(p.severity)}">(${escapeHtml(p.severity)})</span>
  <p style="margin: 4px 0 0; font-size: 13px; color: #5F5E5A;">${escapeHtml(p.description)}</p>
</div>`).join('\n')}

<h2>Recommended experiments</h2>
${(analysis.experiments || []).map((e, i) => `
<div class="card">
  <strong>${i + 1}. ${escapeHtml(e.title)}</strong> <span class="label">${escapeHtml(e.priority)} · ${escapeHtml(e.expected_impact)} impact · ${escapeHtml(e.difficulty)}</span>
  <p style="margin: 4px 0 0; font-size: 13px; color: #5F5E5A;">${escapeHtml(e.hypothesis)}</p>
  <p style="margin: 4px 0 0; font-size: 12px; color: #5F5E5A;">Owner: ${escapeHtml(e.owner)} · Timeline: ${escapeHtml(e.timeline)} · Track: ${escapeHtml(e.metric_to_track)}</p>
</div>`).join('\n')}

<h2>Next steps</h2>
<ol style="font-size: 13px; line-height: 1.8;">
  <li>Run experiment #1 this week</li>
  <li>Re-upload your metrics next week to track progress</li>
  <li>Share this report with your team</li>
</ol>

<div class="footer">Powered by Growth Copilot</div>
</body>
</html>`;
}
