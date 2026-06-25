import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#F1EFE8]">
      <div className="border-b border-[#D3D1C7] bg-white">
        <div className="max-w-5xl mx-auto px-4 h-14" />
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-20" />)}
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
