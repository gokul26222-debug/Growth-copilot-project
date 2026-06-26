'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="border-b border-[#D3D1C7] bg-white">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-[14px] font-medium text-[#2C2C2A]">Growth copilot</Link>
      </div>
    </nav>
  );
}
