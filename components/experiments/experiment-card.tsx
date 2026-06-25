'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Experiment } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ExperimentCardProps {
  experiment: Experiment;
  index: number;
}

const impactVariant: Record<string, 'green' | 'amber' | 'blue'> = {
  high: 'green',
  medium: 'amber',
  low: 'blue',
};

export function ExperimentCard({ experiment, index }: ExperimentCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card padding="sm" className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2">
          <span className="text-[11px] text-[#5F5E5A] mt-0.5">#{index + 1}</span>
          <p className="text-[13px] font-medium text-[#2C2C2A]">{experiment.title}</p>
        </div>
        <div className="flex gap-1 shrink-0">
          <Badge variant={impactVariant[experiment.expected_impact]}>{experiment.expected_impact} impact</Badge>
          <Badge variant="gray">{experiment.priority}</Badge>
        </div>
      </div>

      <p className="text-[12px] text-[#5F5E5A] mb-1">{experiment.problem}</p>

      <div className={cn('overflow-hidden transition-all', expanded ? 'max-h-96 mt-3' : 'max-h-0')}>
        <div className="border-t border-[#D3D1C7] pt-3 space-y-2 text-[12px]">
          <div>
            <span className="text-[#5F5E5A]">Hypothesis: </span>
            <span className="text-[#2C2C2A]">{experiment.hypothesis}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <span className="text-[#5F5E5A]">Difficulty</span>
              <p className="text-[#2C2C2A]">{experiment.difficulty}</p>
            </div>
            <div>
              <span className="text-[#5F5E5A]">Owner</span>
              <p className="text-[#2C2C2A]">{experiment.owner}</p>
            </div>
            <div>
              <span className="text-[#5F5E5A]">Timeline</span>
              <p className="text-[#2C2C2A]">{experiment.timeline}</p>
            </div>
            <div>
              <span className="text-[#5F5E5A]">Metric</span>
              <p className="text-[#2C2C2A]">{experiment.metric_to_track}</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[#185FA5] mt-2">{expanded ? 'Show less' : 'Show more'}</p>
    </Card>
  );
}
