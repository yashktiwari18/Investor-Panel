import { useState } from 'react';
import {
  Bookmark,
  Building2,
  CheckCircle2,
  MessageSquareText,
  XCircle,
} from 'lucide-react';
import type { Role, Venture, VentureStatus } from '../../types';
import StatusBadge from '../common/StatusBadge';
import { Detail, DetailBlock } from '../common/FormField';

export interface VentureDetailsModalProps {
  venture: Venture;
  role: Role | null;
  displayName: string;
  onDecision: (status: VentureStatus, feedback: string, budget: number) => void;
  onInterest: () => void;
}

const dateLabel = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export default function VentureDetailsModal({
  venture,
  role,
  displayName,
  onDecision,
  onInterest,
}: VentureDetailsModalProps) {
  const [feedback, setFeedback] = useState(venture.feedback || '');
  const [budget, setBudget] = useState(String(venture.approvedBudget ?? venture.requestedAmount));
  const interested = Boolean(displayName && venture.interests.includes(displayName));
  const isAdmin = role === 'admin';

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <StatusBadge status={venture.status} />
        <span className="rounded-full bg-[#f0f4f8] px-2.5 py-1 text-[10px] font-semibold text-slate-600">
          {venture.category}
        </span>
      </div>
      <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        <Detail label="Founder" value={venture.founder} />
        <Detail label="University" value={venture.university} />
        <Detail label="Contact" value={venture.email} />
        <Detail label="Submitted" value={dateLabel(venture.createdAt)} />
        <Detail label="Requested funding" value={`₹ ${venture.requestedAmount} Lakhs`} />
        {venture.approvedBudget !== undefined && (
          <Detail label="Approved budget" value={`₹ ${venture.approvedBudget} Lakhs`} />
        )}
      </div>
      <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
        <DetailBlock label="The Project Idea" text={venture.description} />
        <DetailBlock label="Business Model" text={venture.businessModel} />
        <DetailBlock label="Planned Use of Funds" text={venture.useOfFunds} />
      </div>
      {venture.feedback && (
        <div className="mt-5 rounded-xl border-l-2 border-[#83a9ca] bg-[#f6f9fc] px-4 py-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[.1em] text-[#537697]">
            Reviewer Feedback
          </p>
          <p className="text-xs leading-5 text-slate-600">{venture.feedback}</p>
        </div>
      )}

      {/* Signal Interest & Investor Interest List */}
      <div className="mt-5 rounded-2xl border border-blue-100 bg-[#f8fafc] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Bookmark className="size-4 fill-current" />
              </div>
              <p className="text-xs font-bold text-[#1f3853]">Investor Interest</p>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {venture.interests.length
                ? `${venture.interests.length} ${
                    venture.interests.length === 1 ? 'investor / fund' : 'investors / funds'
                  } expressing interest in this project`
                : 'Be the first investor to signal interest.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onInterest}
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-xs font-bold transition shadow-sm ${
              interested
                ? 'border border-blue-300 bg-white text-blue-700 hover:bg-blue-50'
                : 'bg-[#1877f2] text-white hover:bg-[#1264ce]'
            }`}
          >
            <Bookmark className={`size-3.5 ${interested ? 'fill-current' : ''}`} />
            {interested ? 'Withdraw interest' : 'Signal interest'}
          </button>
        </div>

        {/* Detailed List of Interested Investors */}
        <div className="mt-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Interested Investors & Capital Partners ({venture.interests.length}):
          </p>
          {venture.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {venture.interests.map((investorName) => {
                const isYou = Boolean(displayName && investorName === displayName);
                return (
                  <div
                    key={investorName}
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm"
                  >
                    <div className="flex size-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Building2 className="size-3.5" />
                    </div>
                    <span>{investorName}</span>
                    {isYou && (
                      <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                        You
                      </span>
                    )}
                    <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                      Interested
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              No registered investors or angels have signaled interest in this project yet.
            </p>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[.13em] text-[#6384a2]">
            Record Decision & Allocate Grant
          </p>
          <div className="grid gap-3 sm:grid-cols-[.7fr_1.3fr]">
            <label className="block text-xs font-semibold text-slate-600">
              Approved budget (₹ Lakhs)
              <input
                type="number"
                min="0"
                step="0.5"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal text-slate-800 outline-none focus:border-[#76a0c6]"
              />
            </label>
            <label className="block text-xs font-semibold text-slate-600">
              Guidance for Founder
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                placeholder="Share guidance or reasons for your grant decision."
                className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal leading-5 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#76a0c6]"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => onDecision('Not selected', feedback, 0)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
            >
              <XCircle className="size-3.5" />
              Not selected
            </button>
            <button
              type="button"
              onClick={() => onDecision('Revision requested', feedback, 0)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-amber-200 px-3 text-xs font-semibold text-amber-800 transition hover:bg-amber-50"
            >
              <MessageSquareText className="size-3.5" />
              Request revision
            </button>
            <button
              type="button"
              onClick={() =>
                onDecision('Approved', feedback, Math.max(0, Number(budget) || 0))
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#1877f2] px-3.5 text-xs font-bold text-white transition hover:bg-[#1264ce]"
            >
              <CheckCircle2 className="size-3.5" />
              Approve Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
