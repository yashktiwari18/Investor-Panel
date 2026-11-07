import type { VentureStatus } from '../../types';

export const statusStyles: Record<VentureStatus, string> = {
  'Under review': 'bg-amber-50 text-amber-800 ring-amber-200',
  'Revision requested': 'bg-orange-50 text-orange-800 ring-orange-200',
  Approved: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  'Not selected': 'bg-slate-100 text-slate-600 ring-slate-200',
};

export default function StatusBadge({ status }: { status: VentureStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${statusStyles[status]}`}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
