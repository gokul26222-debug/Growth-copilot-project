import { Experiment } from '@/lib/types';
import { ExperimentCard } from './experiment-card';

interface ExperimentListProps {
  experiments: Experiment[];
}

export function ExperimentList({ experiments }: ExperimentListProps) {
  return (
    <div>
      <h2 className="text-[14px] font-medium text-[#2C2C2A] mb-3">Recommended experiments</h2>
      <div className="space-y-3">
        {experiments.map((exp, i) => (
          <ExperimentCard key={i} experiment={exp} index={i} />
        ))}
      </div>
    </div>
  );
}
