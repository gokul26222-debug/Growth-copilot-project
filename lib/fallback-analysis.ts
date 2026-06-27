import { Metrics, Problem, Experiment } from './types';
import { BENCHMARKS } from './constants';

export function generateFallbackProblems(metrics: Metrics): Problem[] {
  const problems: Problem[] = [];

  if (metrics.activation_rate < BENCHMARKS.activation_rate) {
    problems.push({
      title: 'Low activation rate',
      description: `Your activation rate is ${metrics.activation_rate.toFixed(1)}%, which is below the ${BENCHMARKS.activation_rate}% SaaS benchmark. Users are signing up but not reaching their "aha moment". This means your onboarding flow or initial value delivery needs attention.`,
      severity: metrics.activation_rate < BENCHMARKS.activation_rate * 0.5 ? 'critical' : 'warning',
      metric: 'activation_rate',
    });
  }

  if (metrics.conversion_rate < BENCHMARKS.conversion_rate) {
    problems.push({
      title: 'Below-benchmark conversion rate',
      description: `Your conversion rate is ${metrics.conversion_rate.toFixed(1)}% vs the ${BENCHMARKS.conversion_rate}% benchmark. Activated users are not converting to paid plans. Review your pricing page, trial experience, and upgrade prompts.`,
      severity: metrics.conversion_rate < BENCHMARKS.conversion_rate * 0.5 ? 'critical' : 'warning',
      metric: 'conversion_rate',
    });
  }

  if (metrics.retention_rate < BENCHMARKS.retention_rate) {
    problems.push({
      title: 'User retention is dropping',
      description: `Retention is at ${metrics.retention_rate.toFixed(1)}%, below the ${BENCHMARKS.retention_rate}% benchmark. Users are not coming back. Focus on engagement loops, email re-engagement campaigns, and identifying why users leave.`,
      severity: metrics.retention_rate < BENCHMARKS.retention_rate * 0.7 ? 'critical' : 'warning',
      metric: 'retention_rate',
    });
  }

  if (metrics.churn_rate > BENCHMARKS.churn_rate) {
    problems.push({
      title: 'High churn rate',
      description: `Churn is at ${metrics.churn_rate.toFixed(1)}%, above the ${BENCHMARKS.churn_rate}% benchmark. You're losing paid customers faster than healthy SaaS companies. Investigate cancellation reasons and add retention offers.`,
      severity: metrics.churn_rate > BENCHMARKS.churn_rate * 2 ? 'critical' : 'warning',
      metric: 'churn_rate',
    });
  }

  if (metrics.growth_rate < BENCHMARKS.growth_rate) {
    problems.push({
      title: 'Slow user growth',
      description: `Growth rate is ${metrics.growth_rate.toFixed(1)}%, below the ${BENCHMARKS.growth_rate}% benchmark. Your acquisition channels may be saturated or underperforming. Consider expanding to new channels or optimizing existing ones.`,
      severity: metrics.growth_rate < 0 ? 'critical' : 'warning',
      metric: 'growth_rate',
    });
  }

  if (problems.length === 0) {
    problems.push({
      title: 'Metrics are healthy',
      description: 'All your key metrics are at or above SaaS benchmarks. Focus on maintaining momentum and finding new growth levers.',
      severity: 'info',
      metric: 'growth_rate',
    });
  }

  return problems.slice(0, 3);
}

export function generateFallbackExperiments(problems: Problem[], metrics: Metrics): Experiment[] {
  const experiments: Experiment[] = [];

  for (const problem of problems) {
    switch (problem.metric) {
      case 'activation_rate':
        experiments.push({
          title: 'Simplify onboarding to 3 steps',
          problem: problem.title,
          hypothesis: 'Reducing onboarding friction from current flow to 3 steps will increase activation by 15-20%',
          expected_impact: 'high',
          difficulty: 'medium',
          priority: 'P0',
          metric_to_track: 'activation_rate',
          owner: 'PM',
          timeline: '2 weeks',
        });
        experiments.push({
          title: 'Add interactive product tour',
          problem: problem.title,
          hypothesis: 'Guided walkthroughs help users discover core value faster, increasing activation',
          expected_impact: 'medium',
          difficulty: 'easy',
          priority: 'P1',
          metric_to_track: 'activation_rate',
          owner: 'Design',
          timeline: '1 week',
        });
        break;
      case 'conversion_rate':
        experiments.push({
          title: 'Add social proof to pricing page',
          problem: problem.title,
          hypothesis: 'Showing customer logos and testimonials on pricing page will increase conversion by 10-15%',
          expected_impact: 'medium',
          difficulty: 'easy',
          priority: 'P0',
          metric_to_track: 'conversion_rate',
          owner: 'Marketing',
          timeline: '1 week',
        });
        experiments.push({
          title: 'Extend free trial from 7 to 14 days',
          problem: problem.title,
          hypothesis: 'Longer trial gives users more time to experience value, increasing paid conversion',
          expected_impact: 'high',
          difficulty: 'easy',
          priority: 'P1',
          metric_to_track: 'conversion_rate',
          owner: 'PM',
          timeline: '1 week',
        });
        break;
      case 'retention_rate':
        experiments.push({
          title: 'Launch weekly engagement email series',
          problem: problem.title,
          hypothesis: 'Automated usage tips and feature highlights will bring inactive users back, improving retention by 10%',
          expected_impact: 'high',
          difficulty: 'medium',
          priority: 'P0',
          metric_to_track: 'retention_rate',
          owner: 'Marketing',
          timeline: '2 weeks',
        });
        break;
      case 'churn_rate':
        experiments.push({
          title: 'Add cancellation survey and save offer',
          problem: problem.title,
          hypothesis: 'Understanding why users cancel and offering a discount or pause will reduce churn by 15-20%',
          expected_impact: 'high',
          difficulty: 'easy',
          priority: 'P0',
          metric_to_track: 'churn_rate',
          owner: 'PM',
          timeline: '1 week',
        });
        break;
      case 'growth_rate':
        experiments.push({
          title: 'Launch referral program with 2-sided incentive',
          problem: problem.title,
          hypothesis: 'Giving existing users a reason to invite others will create a viral loop and increase growth by 20%',
          expected_impact: 'high',
          difficulty: 'medium',
          priority: 'P1',
          metric_to_track: 'growth_rate',
          owner: 'Marketing',
          timeline: '3 weeks',
        });
        break;
    }
  }

  if (experiments.length < 5) {
    const fillers: Experiment[] = [
      {
        title: 'A/B test CTA button copy on landing page',
        problem: 'Optimizing top-of-funnel conversion',
        hypothesis: 'Changing CTA from "Get Started" to "Start Free Analysis" will increase signups by 10%',
        expected_impact: 'medium',
        difficulty: 'easy',
        priority: 'P1',
        metric_to_track: 'signups',
        owner: 'Marketing',
        timeline: '1 week',
      },
      {
        title: 'Add in-app NPS survey at day 7',
        problem: 'Understanding user satisfaction',
        hypothesis: 'Collecting NPS at day 7 will identify at-risk users before they churn and give actionable feedback',
        expected_impact: 'medium',
        difficulty: 'easy',
        priority: 'P2',
        metric_to_track: 'retention_rate',
        owner: 'PM',
        timeline: '1 week',
      },
      {
        title: 'Optimize page load speed to under 2 seconds',
        problem: 'User experience and bounce rate',
        hypothesis: 'Faster load times reduce bounce rate and improve activation by 5-10%',
        expected_impact: 'medium',
        difficulty: 'hard',
        priority: 'P2',
        metric_to_track: 'activation_rate',
        owner: 'Engineering',
        timeline: '2 weeks',
      },
    ];
    for (const f of fillers) {
      if (experiments.length >= 5) break;
      experiments.push(f);
    }
  }

  return experiments.slice(0, 5);
}
