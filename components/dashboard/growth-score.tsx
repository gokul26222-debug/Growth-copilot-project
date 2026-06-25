import { Card } from '@/components/ui/card';
import { getScoreColor } from '@/lib/utils';

interface GrowthScoreProps {
  score: number;
}

export function GrowthScore({ score }: GrowthScoreProps) {
  const { bg, text, label } = getScoreColor(score);

  return (
    <Card className="text-center">
      <p className="text-[12px] text-[#5F5E5A] mb-2">Growth score</p>
      <div className={`inline-flex items-baseline gap-1 px-4 py-2 rounded-xl ${bg}`}>
        <span className={`text-[36px] font-medium ${text}`}>{score}</span>
        <span className={`text-[14px] ${text}`}>/100</span>
      </div>
      <p className={`text-[12px] mt-2 ${text}`}>{label}</p>
    </Card>
  );
}
