import { Bookmark } from 'lucide-react';
import type { Venture } from '../../types';

export const formatPriceBadge = (rangeId: string) => {
  if (rangeId === '50+') return '₹ 50+';
  return `₹ ${rangeId.replace('-', ' - ')}`;
};

export function FeaturedHighlightCard({
  venture,
  onSelect,
  onInterest,
  isInterested,
}: {
  venture: Venture;
  onSelect: () => void;
  onInterest: () => void;
  isInterested: boolean;
}) {
  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md">
      <div className="flex gap-3.5 items-start">
        {/* Left Thumbnail Image */}
        <div
          onClick={onSelect}
          className="relative size-20 sm:size-24 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-slate-100"
        >
          <img
            src={venture.imageUrl || 'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?w=300&auto=format&fit=crop&q=80'}
            alt={venture.name}
            className="size-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=80';
            }}
          />
        </div>

        {/* Right Content */}
        <div className="min-w-0 flex-1">
          <button type="button" onClick={onSelect} className="block text-left w-full">
            <h3 className="font-[var(--app-font-serif)] text-sm font-bold tracking-tight text-[#112d4e] group-hover:text-blue-600 transition truncate">
              {venture.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
              {venture.tagline}
            </p>
          </button>
        </div>
      </div>

      {/* Bottom Metadata row */}
      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
        <div className="flex items-center gap-2">
          {/* Category Pill with small blue dot */}
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
            <span className="size-1.5 rounded-full bg-blue-600" />
            <span>{venture.category}</span>
          </span>

          {/* Price Range Pill */}
          <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
            <span>{formatPriceBadge(venture.priceRange || '15-30')}</span>
          </span>
        </div>

        {/* Bookmark Icon */}
        <button
          type="button"
          onClick={onInterest}
          className={`p-1 transition ${
            isInterested ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'
          }`}
          title={isInterested ? 'Bookmarked' : 'Bookmark project'}
        >
          <Bookmark className={`size-3.5 ${isInterested ? 'fill-current' : ''}`} />
        </button>
      </div>
    </article>
  );
}

export function CompactProjectCard({
  venture,
  onSelect,
  onInterest,
  isInterested,
}: {
  venture: Venture;
  onSelect: () => void;
  onInterest: () => void;
  isInterested: boolean;
}) {
  return (
    <article
      onClick={onSelect}
      className="group flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-[#fbfcfd] p-2 transition hover:border-blue-200 hover:bg-white hover:shadow-xs"
    >
      {/* Square Thumbnail Image */}
      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        <img
          src={venture.imageUrl || 'https://images.unsplash.com/photo-1558441719-aa34bbe5f347?w=150&auto=format&fit=crop&q=80'}
          alt={venture.name}
          className="size-full object-cover transition duration-200 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80';
          }}
        />
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-xs font-bold text-[#112d4e] group-hover:text-blue-600 transition">
          {venture.name}
        </h4>
        <div className="mt-1 flex items-center gap-2">
          {/* Category */}
          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
            <span className="size-1 rounded-full bg-blue-500" />
            <span className="truncate max-w-[80px]">{venture.category}</span>
          </span>
          {/* Price */}
          <span className="text-[10px] font-bold text-[#1877f2]">
            {formatPriceBadge(venture.priceRange || '15-30')}
          </span>
        </div>
      </div>

      {/* Bookmark button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onInterest();
        }}
        className={`p-1 transition opacity-70 group-hover:opacity-100 ${
          isInterested ? 'text-blue-600' : 'text-slate-300 hover:text-blue-600'
        }`}
      >
        <Bookmark className={`size-3.5 ${isInterested ? 'fill-current' : ''}`} />
      </button>
    </article>
  );
}
