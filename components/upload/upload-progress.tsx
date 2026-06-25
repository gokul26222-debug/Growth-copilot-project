'use client';

import { UploadStep } from '@/lib/types';
import { cn } from '@/lib/utils';

interface UploadProgressProps {
  step: UploadStep;
  progress: number;
  error: string | null;
}

const steps = [
  { key: 'uploading', label: 'Data uploaded' },
  { key: 'calculating', label: 'Metrics calculated' },
  { key: 'analyzing', label: 'Finding growth gaps' },
  { key: 'generating', label: 'Generating experiments' },
  { key: 'saving', label: 'Building report' },
] as const;

const stepOrder: Record<string, number> = {
  uploading: 0, parsing: 0, calculating: 1, analyzing: 2, generating: 3, saving: 4, completed: 5,
};

export function UploadProgress({ step, progress, error }: UploadProgressProps) {
  const currentIndex = stepOrder[step] ?? -1;

  return (
    <div className="max-w-sm mx-auto text-center">
      <h2 className="text-[18px] font-medium text-[#2C2C2A] mb-2">
        {error ? 'Something went wrong' : step === 'completed' ? 'Analysis complete' : 'Analyzing your data...'}
      </h2>

      {error && (
        <p className="text-[13px] text-[#A32D2D] mb-4">{error}</p>
      )}

      {!error && (
        <>
          <div className="w-full h-1.5 bg-[#F1EFE8] rounded-full mb-6">
            <div
              className="h-full bg-[#185FA5] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-3 text-left">
            {steps.map((s, i) => {
              const isDone = currentIndex > i || step === 'completed';
              const isCurrent = currentIndex === i && step !== 'completed';

              return (
                <div key={s.key} className="flex items-center gap-3">
                  <div className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0',
                    isDone && 'bg-[#0F6E56] text-white',
                    isCurrent && 'bg-[#185FA5] text-white animate-pulse',
                    !isDone && !isCurrent && 'bg-[#D3D1C7] text-[#5F5E5A]'
                  )}>
                    {isDone ? '✓' : i + 1}
                  </div>
                  <span className={cn(
                    'text-[13px]',
                    isDone && 'text-[#0F6E56]',
                    isCurrent && 'text-[#2C2C2A] font-medium',
                    !isDone && !isCurrent && 'text-[#5F5E5A]'
                  )}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
