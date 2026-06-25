export function formatPercent(value: number): string {
  return `${Math.round(value * 100) / 100}%`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function truncateFileName(name: string, maxLength: number = 30): string {
  if (name.length <= maxLength) return name;
  const ext = name.slice(name.lastIndexOf('.'));
  return name.slice(0, maxLength - ext.length - 3) + '...' + ext;
}

export function getScoreColor(score: number): { bg: string; text: string; label: string } {
  if (score >= 80) return { bg: 'bg-[#E1F5EE]', text: 'text-[#0F6E56]', label: 'Strong growth' };
  if (score >= 50) return { bg: 'bg-[#FAEEDA]', text: 'text-[#BA7517]', label: 'Needs attention' };
  return { bg: 'bg-[#FCEBEB]', text: 'text-[#A32D2D]', label: 'Critical issues' };
}

export function getSeverityColor(severity: 'critical' | 'warning' | 'info'): { bg: string; text: string } {
  switch (severity) {
    case 'critical': return { bg: 'bg-[#FCEBEB]', text: 'text-[#A32D2D]' };
    case 'warning': return { bg: 'bg-[#FAEEDA]', text: 'text-[#BA7517]' };
    case 'info': return { bg: 'bg-[#E6F1FB]', text: 'text-[#185FA5]' };
  }
}

export function getImpactColor(impact: 'high' | 'medium' | 'low'): { bg: string; text: string } {
  switch (impact) {
    case 'high': return { bg: 'bg-[#E1F5EE]', text: 'text-[#0F6E56]' };
    case 'medium': return { bg: 'bg-[#FAEEDA]', text: 'text-[#BA7517]' };
    case 'low': return { bg: 'bg-[#E6F1FB]', text: 'text-[#185FA5]' };
  }
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
