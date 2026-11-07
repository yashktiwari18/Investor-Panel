import type { LucideIcon } from 'lucide-react';

export interface MetricCardProps {
  label: string;
  value: string | number;
  note: string;
  icon: LucideIcon;
  tone?: 'blue' | 'green' | 'amber' | 'violet' | string;
}

export default function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  tone = 'blue',
}: MetricCardProps) {
  const tones: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    violet: 'bg-indigo-50 text-indigo-700',
  };

  return (
    <article className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_2px_7px_rgba(32,59,88,.025)]">
      <div className="flex items-start justify-between">
        <span className="text-[13px] font-medium text-slate-500">{label}</span>
        <span className={`flex size-9 items-center justify-center rounded-xl ${tones[tone] || tones.blue}`}>
          <Icon className="size-[17px]" />
        </span>
      </div>
      <div className="mt-4 font-[var(--app-font-serif)] text-[30px] font-bold leading-none tracking-[-.05em] text-[#1d3551]">
        {value}
      </div>
      <p className="mt-2 text-xs text-slate-500">{note}</p>
    </article>
  );
}
