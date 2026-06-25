import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-[#D3D1C7]">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-[14px] font-medium text-[#2C2C2A]">Growth copilot</span>
          <Link href="/login">
            <Button variant="secondary" size="sm">Log in</Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 pt-20 pb-16 text-center">
        <Badge variant="blue" className="mb-4">AI-powered growth analysis</Badge>

        <h1 className="text-[28px] font-medium text-[#2C2C2A] mb-3 leading-tight">
          Find your biggest growth gap in 3 minutes
        </h1>

        <p className="text-[14px] text-[#5F5E5A] mb-8 max-w-lg mx-auto">
          Upload your metrics. AI finds the problems. You get experiments to run.
        </p>

        <Link href="/login">
          <Button size="lg">Get started free</Button>
        </Link>

        <p className="text-[11px] text-[#5F5E5A] mt-3">
          No credit card. No setup. Free forever.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
          {[
            { step: '1', title: 'Upload CSV', desc: 'Drop your product metrics file' },
            { step: '2', title: 'AI analysis', desc: 'We find your biggest growth gaps' },
            { step: '3', title: 'Get experiments', desc: 'Actionable experiments to run this week' },
          ].map((item) => (
            <div key={item.step} className="bg-[#F1EFE8] rounded-xl p-5 text-left">
              <div className="w-7 h-7 rounded-lg bg-[#E6F1FB] text-[#185FA5] text-[12px] font-medium flex items-center justify-center mb-3">
                {item.step}
              </div>
              <p className="text-[14px] font-medium text-[#2C2C2A] mb-1">{item.title}</p>
              <p className="text-[12px] text-[#5F5E5A]">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
