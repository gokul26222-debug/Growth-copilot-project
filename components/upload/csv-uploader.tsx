'use client';

import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UPLOAD_LIMITS } from '@/lib/constants';

interface CSVUploaderProps {
  onUpload: (file: File | 'sample') => void;
  disabled?: boolean;
}

export function CSVUploader({ onUpload, disabled }: CSVUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndUpload = useCallback((file: File) => {
    setError(null);

    if (file.size > UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES) {
      setError('This file is over 5MB. Try a shorter date range.');
      return;
    }

    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!(UPLOAD_LIMITS.ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
      setError('Please upload a .csv file.');
      return;
    }

    onUpload(file);
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndUpload(file);
  }, [validateAndUpload]);

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors',
          dragActive ? 'border-[#185FA5] bg-[#E6F1FB]' : 'border-[#D3D1C7] hover:border-[#185FA5]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) validateAndUpload(file);
          }}
          disabled={disabled}
        />
        <div className="text-[14px] text-[#2C2C2A] mb-1">Drop your CSV here</div>
        <div className="text-[12px] text-[#5F5E5A]">or click to browse files</div>
      </div>

      {error && (
        <p className="text-[12px] text-[#A32D2D]">{error}</p>
      )}

      <button
        onClick={() => onUpload('sample')}
        disabled={disabled}
        className="w-full text-[13px] text-[#185FA5] hover:underline disabled:opacity-50"
      >
        Try with sample data
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5F5E5A]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        Encrypted. Never shared.
      </div>
    </div>
  );
}
