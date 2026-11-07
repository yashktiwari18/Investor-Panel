import { ArrowRight } from 'lucide-react';
import type { Venture } from '../../types';
import { PRICE_RANGES, CATEGORIES, type PriceRange } from '../../constants';
import { CompactProjectCard, FeaturedHighlightCard } from './ProjectCards';

export { PRICE_RANGES, CATEGORIES, type PriceRange };

export interface DealPipelineProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedRange: string | null;
  setSelectedRange: (range: string | null) => void;
  topFeatured: Venture[];
  rangeGroups: Record<string, Venture[]>;
  displayName: string;
  onSelectVenture: (v: Venture) => void;
  onToggleInterest: (v: Venture) => void;
  inform: (msg: string) => void;
}

export default function DealPipeline({
  selectedCategory,
  setSelectedCategory,
  selectedRange,
  setSelectedRange,
  topFeatured,
  rangeGroups,
  displayName,
  onSelectVenture,
  onToggleInterest,
  inform,
}: DealPipelineProps) {
  return (
    <section className="space-y-6">
      {/* Category Pills Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <h2 className="font-[var(--app-font-serif)] text-2xl font-bold tracking-tight text-[#112d4e]">
            Curated Collegiate Innovation Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pre-screened campus inventions with active grants and verified student founder identity.
          </p>
        </div>

        {/* 3 Main Category Pills */}
        <div className="flex items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedRange(null);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition shadow-xs ${
                selectedCategory === cat.id
                  ? 'bg-[#1877f2] text-white shadow-blue-500/20'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <cat.icon className="size-3.5" />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Featured Highlight Cards */}
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        {topFeatured.map((venture) => (
          <FeaturedHighlightCard
            key={venture.id}
            venture={venture}
            onSelect={() => onSelectVenture(venture)}
            onInterest={() => onToggleInterest(venture)}
            isInterested={venture.interests.includes(displayName || 'Interested Investor')}
          />
        ))}
      </div>

      {/* Price Range Rows with Left Side-Panel Indicators */}
      <div className="space-y-3 pt-2">
        {PRICE_RANGES.map((range) => {
          const ventures = rangeGroups[range.id] || [];
          const isRangeSelected = selectedRange === range.id;

          if (selectedRange && !isRangeSelected) {
            return null;
          }

          return (
            <div
              key={range.id}
              className={`flex flex-col lg:flex-row items-stretch lg:items-center gap-3 rounded-2xl border p-3 transition ${
                isRangeSelected
                  ? 'border-blue-400 bg-blue-50/40 shadow-sm'
                  : 'border-slate-200/80 bg-white hover:border-slate-300'
              }`}
            >
              {/* Left Side Panel Range Tag with Blue Line Indicator */}
              <button
                type="button"
                onClick={() => setSelectedRange(isRangeSelected ? null : range.id)}
                className="flex shrink-0 items-center gap-3 px-3 py-1 text-left group"
                title={`Click to filter by ${range.label}`}
              >
                <div className="h-7 w-1 rounded-full bg-[#1877f2]" />
                <span className="w-16 text-sm font-extrabold text-[#112d4e] group-hover:text-blue-600 transition">
                  {range.label}
                </span>
              </button>

              {/* 3 Compact Project Cards in this Row */}
              <div className="grid flex-1 gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {ventures.slice(0, 3).map((v) => (
                  <CompactProjectCard
                    key={v.id}
                    venture={v}
                    onSelect={() => onSelectVenture(v)}
                    onInterest={() => onToggleInterest(v)}
                    isInterested={v.interests.includes(displayName || 'Interested Investor')}
                  />
                ))}
                {ventures.length === 0 && (
                  <div className="col-span-3 py-3 text-center text-xs text-slate-400">
                    No projects currently listed in ₹ {range.label}
                  </div>
                )}
              </div>

              {/* Right Circular Blue Arrow Button */}
              <div className="hidden lg:flex shrink-0 items-center justify-center pl-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRange(isRangeSelected ? null : range.id);
                    inform(`Viewing projects in range ₹ ${range.label}`);
                  }}
                  className="flex size-9 items-center justify-center rounded-full bg-[#eef5fd] text-[#1877f2] transition hover:bg-blue-100 hover:scale-105"
                  aria-label={`View more in ${range.label}`}
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          );
        })}

        {selectedRange && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setSelectedRange(null)}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
            >
              Show All Price Ranges
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
