import { Card } from '@/components/ui/card';
import { BENCHMARKS } from '@/lib/constants';
import { cn, formatPercent } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: number;
  benchmarkKey: keyof typeof BENCHMARKS;
  invertComparison?: boolean;
}

export function MetricCard({ label, value, benchmarkKey, invertComparison }: MetricCardProps) {
  const benchmark = BENCHMARKS[benchmarkKey];
  const isGood = invertComparison ? value <= benchmark : value >= benchmark;
  const displayValue = Math.min(value, 999);

  return (
    <Card padding="sm">
      <p className="text-[11px] text-[#5F5E5A] mb-1">{label}</p>
      <p className={cn(
        'text-[24px] font-medium',
        isGood ? 'text-[#0F6E56]' : 'text-[#A32D2D]'
      )}>
        {formatPercent(displayValue)}
      </p>
      <p className="text-[11px] text-[#5F5E5A]">
        Benchmark: {formatPercent(benchmark)}
      </p>
    </Card>
  );
}
