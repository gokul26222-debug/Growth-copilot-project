import { Card } from '@/components/ui/card';

export function EmptyState() {
  return (
    <Card className="text-center py-12">
      <p className="text-[14px] text-[#2C2C2A] mb-1">No analyses yet</p>
      <p className="text-[12px] text-[#5F5E5A]">Upload a CSV to get started with your first growth analysis.</p>
    </Card>
  );
}
