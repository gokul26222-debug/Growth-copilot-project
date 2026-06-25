import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Problem } from '@/lib/types';

interface ProblemListProps {
  problems: Problem[];
}

const severityVariant: Record<string, 'red' | 'amber' | 'blue'> = {
  critical: 'red',
  warning: 'amber',
  info: 'blue',
};

export function ProblemList({ problems }: ProblemListProps) {
  return (
    <div>
      <h2 className="text-[14px] font-medium text-[#2C2C2A] mb-3">Biggest problems</h2>
      <div className="space-y-3">
        {problems.map((problem, i) => (
          <Card key={i} padding="sm">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-[13px] font-medium text-[#2C2C2A]">{problem.title}</p>
              <Badge variant={severityVariant[problem.severity]}>{problem.severity}</Badge>
            </div>
            <p className="text-[12px] text-[#5F5E5A]">{problem.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
