import { MetricRow, Metrics } from './types';
import { BENCHMARKS, SCORE_WEIGHTS } from './constants';

function safeDivide(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return (numerator / denominator) * 100;
}

export function calculateMetrics(data: MetricRow[]): Metrics {
  const current = data[data.length - 1];
  const previous = data[0];

  return {
    activation_rate: Math.round(safeDivide(current.activated_users, current.signups) * 100) / 100,
    conversion_rate: Math.round(safeDivide(current.paid_users, current.activated_users) * 100) / 100,
    retention_rate: Math.round(safeDivide(current.retained_users, current.users) * 100) / 100,
    churn_rate: Math.round(safeDivide(current.cancelled_users, current.paid_users) * 100) / 100,
    growth_rate: Math.round(safeDivide(current.users - previous.users, previous.users) * 100) / 100,
  };
}

export function calculateGrowthScore(metrics: Metrics): number {
  const activationScore = Math.min(metrics.activation_rate / BENCHMARKS.activation_rate, 1);
  const conversionScore = Math.min(metrics.conversion_rate / BENCHMARKS.conversion_rate, 1);
  const retentionScore = Math.min(metrics.retention_rate / BENCHMARKS.retention_rate, 1);
  const churnScore = metrics.churn_rate === 0 ? 1 : Math.min(BENCHMARKS.churn_rate / metrics.churn_rate, 1);

  const weighted =
    activationScore * SCORE_WEIGHTS.activation_rate +
    conversionScore * SCORE_WEIGHTS.conversion_rate +
    retentionScore * SCORE_WEIGHTS.retention_rate +
    churnScore * SCORE_WEIGHTS.churn_rate;

  return Math.round(Math.max(0, Math.min(100, weighted * 100)));
}
