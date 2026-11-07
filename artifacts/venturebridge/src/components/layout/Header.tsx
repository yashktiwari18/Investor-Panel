import {
  BriefcaseBusiness,
  GraduationCap,
  HandCoins,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type { Role, Venture } from '../../types';
import { CATEGORIES, PRICE_RANGES } from '../../constants';
import IdeaBridgeLogo from '../common/IdeaBridgeLogo';

export interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  role: Role | null;
  displayName: string;
  roleTitles: Record<Role, string>;
  selectedRange: string | null;
  setSelectedRange: (range: string | null) => void;
  rangeGroups: Record<string, Venture[]>;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  onLogoClick: () => void;
  onOpenWorkspace: () => void;
  onSignOut: () => void;
  onInvestorLogin: () => void;
  onListProject: () => void;
  onEnterWorkspace: (role: Role, name: string) => void;
  onResetData: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  role,
  displayName,
  roleTitles,
  selectedRange,
  setSelectedRange,
  rangeGroups,
  selectedCategory,
  setSelectedCategory,
  menuOpen,
  setMenuOpen,
  onLogoClick,
  onOpenWorkspace,
  onSignOut,
  onInvestorLogin,
  onListProject,
  onEnterWorkspace,
  onResetData,
}: HeaderProps) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          {/* Top row: Logo on left, Search in middle, Actions on right */}
          <div className="flex h-14 items-center justify-between gap-3 py-2">
            <IdeaBridgeLogo onClick={onLogoClick} />

            {/* Central Search Bar (Desktop) */}
            <div className="hidden sm:block max-w-xl flex-1 px-4 lg:px-8">
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects, startups, founders, or keywords..."
                  className="h-10 w-full rounded-full border border-slate-200 bg-[#f8fafc] pl-10 pr-9 text-xs sm:text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {role ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={onOpenWorkspace}
                    className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-blue-800 transition hover:bg-blue-100"
                    title="Open workspace"
                  >
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="max-w-[70px] sm:max-w-none truncate">{displayName}</span>
                    <span className="hidden sm:inline text-[10px] font-normal text-blue-600">
                      ({roleTitles[role]})
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onInvestorLogin}
                  className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-blue-700"
                >
                  <BriefcaseBusiness className="size-3.5 text-slate-500" />
                  <span>Investor Login</span>
                </button>
              )}

              <button
                type="button"
                onClick={onListProject}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#1877f2] px-3 sm:px-3.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1264ce]"
              >
                <Plus className="size-3.5" />
                <span className="hidden sm:inline">List Project</span>
                <span className="sm:hidden">List</span>
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                aria-label="Toggle menu"
              >
                <Menu className="size-5" />
              </button>
            </div>
          </div>

          {/* Mobile Full-Width Search Bar (< sm) */}
          <div className="block sm:hidden pb-2.5">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, startups, founders..."
                className="h-10 w-full rounded-full border border-slate-200 bg-[#f8fafc] pl-9 pr-9 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Price Range Filter Row */}
        <div className="border-t border-slate-100 bg-[#fbfcfd] px-3 sm:px-4 py-2">
          <div className="mx-auto flex max-w-7xl items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1 sm:justify-center sm:flex-wrap">
            {PRICE_RANGES.slice().reverse().map((range) => {
              const active = selectedRange === range.id;
              const count = rangeGroups[range.id]?.length || 0;
              return (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => setSelectedRange(active ? null : range.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition ${
                    active
                      ? 'bg-[#1877f2] text-white shadow-sm ring-2 ring-blue-300/40'
                      : 'border border-slate-200/90 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>₹ {range.label}</span>
                  {count > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                        active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
            {selectedRange && (
              <button
                type="button"
                onClick={() => setSelectedRange(null)}
                className="shrink-0 whitespace-nowrap text-[11px] font-medium text-slate-400 underline decoration-slate-300 underline-offset-2 hover:text-slate-600 px-1"
              >
                Show all ranges
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs (Retail, Manufacturing, Service) */}
        <div className="border-t border-slate-100 bg-white px-3 sm:px-4">
          <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto no-scrollbar justify-start sm:justify-center px-1">
            {CATEGORIES.map(({ id, label, icon: Icon }) => {
              const active = selectedCategory === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedCategory(active ? 'All' : id)}
                  className={`group relative flex shrink-0 items-center gap-2 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                    active ? 'text-[#1877f2]' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon
                    className={`size-4 transition ${
                      active ? 'text-[#1877f2]' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1877f2]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Role Switcher Drawer Menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="w-full max-w-xs bg-white p-6 shadow-2xl animate-rise"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <IdeaBridgeLogo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Workspace Roles
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEnterWorkspace('student', 'Maya Chen');
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-blue-400 hover:bg-blue-50/50"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <GraduationCap className="size-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Creator Workspace</span>
                    <span className="block text-[11px] text-slate-500">Submit and track ideas</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEnterWorkspace('investor', 'Northstar Ventures');
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-blue-400 hover:bg-blue-50/50"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <HandCoins className="size-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Investor Workspace</span>
                    <span className="block text-[11px] text-slate-500">Discover and fund ventures</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEnterWorkspace('admin', 'Morgan Lee');
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-blue-400 hover:bg-blue-50/50"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Program Administrator</span>
                    <span className="block text-[11px] text-slate-500">Review and allocate funding</span>
                  </div>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onListProject();
                  }}
                  className="flex w-full items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow transition hover:bg-blue-700"
                >
                  <Plus className="size-4" />
                  <span>List Your Project</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onResetData();
                  }}
                  className="flex w-full items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <SlidersHorizontal className="size-3.5 text-slate-400" />
                  <span>Reset demo data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
