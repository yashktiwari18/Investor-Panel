import { Search, X } from 'lucide-react';
import type { Venture } from '../../types';
import { PRICE_RANGES } from '../../constants';
import { CompactProjectCard, FeaturedHighlightCard } from './ProjectCards';

export interface SearchResultsViewProps {
  searchQuery: string;
  searchResults: Venture[];
  rangeGroups: Record<string, Venture[]>;
  displayName: string;
  onClearSearch: () => void;
  onSelectVenture: (venture: Venture) => void;
  onToggleInterest: (venture: Venture) => void;
}

export default function SearchResultsView({
  searchQuery,
  searchResults,
  rangeGroups,
  displayName,
  onClearSearch,
  onSelectVenture,
  onToggleInterest,
}: SearchResultsViewProps) {
  return (
    <section className="space-y-6 pt-2 animate-rise">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-[var(--app-font-serif)] text-2xl font-bold tracking-tight text-[#112d4e]">
              Search Results for "{searchQuery}"
            </h2>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
              {searchResults.length}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Showing matching projects on top. All other unrelated projects are hidden.
          </p>
        </div>
        <button
          type="button"
          onClick={onClearSearch}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition self-start sm:self-auto"
        >
          <X className="size-3.5 text-slate-400" />
          <span>Clear Search</span>
        </button>
      </div>

      {/* Matched project cards */}
      {searchResults.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {searchResults.map((venture) => (
            <FeaturedHighlightCard
              key={venture.id}
              venture={venture}
              onSelect={() => onSelectVenture(venture)}
              onInterest={() => onToggleInterest(venture)}
              isInterested={venture.interests.includes(displayName || 'Interested Investor')}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Search className="size-8 text-slate-300" />
          <h3 className="mt-3 text-sm font-bold text-slate-700">No project matched "{searchQuery}"</h3>
          <p className="mt-1 text-xs text-slate-400">Please check the spelling or search for another keyword.</p>
          <button
            type="button"
            onClick={onClearSearch}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
          >
            Clear Search & View All
          </button>
        </div>
      )}

      {/* Price Range Breakdown: Only rows that have matching ventures */}
      {searchResults.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Price Range Breakdown
          </h3>
          {PRICE_RANGES.map((range) => {
            const ventures = rangeGroups[range.id] || [];
            if (ventures.length === 0) return null;

            return (
              <div
                key={range.id}
                className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50/20 p-3 shadow-2xs"
              >
                <div className="flex shrink-0 items-center gap-3 px-3 py-1">
                  <div className="h-7 w-1 rounded-full bg-[#1877f2]" />
                  <span className="w-16 text-sm font-extrabold text-[#112d4e]">
                    {range.label}
                  </span>
                </div>

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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
