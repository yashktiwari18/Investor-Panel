import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  FilePlus2,
  FileText,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type { DemoData, Role, Venture, VentureStatus } from '../../types';
import IdeaBridgeLogo from '../common/IdeaBridgeLogo';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import MetricCard from '../common/MetricCard';
import { FeaturedHighlightCard } from '../home/ProjectCards';
import ApplicationForm from '../forms/ApplicationForm';
import VentureDetailsModal from '../modals/VentureDetailsModal';

export type WorkspacePage = 'overview' | 'applications' | 'submit' | 'review' | 'discover';

export interface WorkspaceViewProps {
  role: Role;
  displayName: string;
  roleTitles: Record<Role, string>;
  page: 'front' | WorkspacePage | string;
  setPage: (p: any) => void;
  data: DemoData;
  mine: Venture[];
  approved: Venture[];
  mobileNav: boolean;
  setMobileNav: (v: boolean) => void;
  signOut: () => void;
  reset: () => void;
  selectedVenture: Venture | null;
  setSelectedVenture: (v: Venture | null) => void;
  changeVenture: (id: string, patch: Partial<Venture>) => void;
  toggleInterest: (v: Venture) => void;
  addApplication: (form: HTMLFormElement) => void;
  inform: (msg: string) => void;
  toast: string;
}

export default function WorkspaceView({
  role,
  displayName,
  roleTitles,
  page,
  setPage,
  data,
  mine,
  approved,
  mobileNav,
  setMobileNav,
  signOut,
  reset,
  selectedVenture,
  setSelectedVenture,
  changeVenture,
  toggleInterest,
  addApplication,
  inform,
  toast,
}: WorkspaceViewProps) {
  const greeting =
    role === 'student' ? displayName.split(' ')[0] : role === 'admin' ? 'Morgan' : displayName;

  const nav: { key: WorkspacePage; label: string; icon: typeof LayoutDashboard }[] =
    role === 'student'
      ? [
          { key: 'overview', label: 'Overview', icon: LayoutDashboard },
          { key: 'applications', label: 'My applications', icon: FileText },
          { key: 'submit', label: 'New application', icon: FilePlus2 },
        ]
      : role === 'admin'
      ? [
          { key: 'overview', label: 'Overview', icon: LayoutDashboard },
          { key: 'review', label: 'Review queue', icon: ShieldCheck },
        ]
      : [
          { key: 'overview', label: 'Overview', icon: LayoutDashboard },
          { key: 'discover', label: 'Discover ventures', icon: Compass },
        ];

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      {mobileNav && (
        <button
          className="fixed inset-0 z-30 bg-[#142b45]/35 md:hidden"
          onClick={() => setMobileNav(false)}
          aria-label="Close navigation"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[256px] flex-col border-r border-[#e7ebf1] bg-white px-4 transition-transform duration-200 md:translate-x-0 ${
          mobileNav ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[76px] items-center justify-between px-2">
          <IdeaBridgeLogo onClick={() => setPage('front')} />
          <button
            className="rounded-lg p-2 text-slate-400 md:hidden"
            onClick={() => setMobileNav(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Back to Home Button */}
        <button
          type="button"
          onClick={() => setPage('front')}
          className="mb-4 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
        >
          <ArrowRight className="size-3.5 rotate-180" />
          <span>Back to IdeaBridge Home</span>
        </button>

        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">
          Workspace
        </div>
        <nav className="space-y-1">
          {nav.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setPage(item.key);
                setMobileNav(false);
              }}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition ${
                page === item.key
                  ? 'bg-[#eaf2fa] text-[#1c578a]'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#243c57]'
              }`}
            >
              <item.icon
                className={`size-[17px] ${
                  page === item.key ? 'text-[#286697]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-100 py-4">
          <button
            onClick={reset}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-[#243c57]"
          >
            <SlidersHorizontal className="size-4 text-slate-400" />
            Reset demo data
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="md:pl-[256px]">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-[#e7ebf1] bg-white/95 px-4 backdrop-blur-md sm:px-7 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
              onClick={() => setMobileNav(true)}
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="font-[var(--app-font-serif)] text-[18px] font-bold text-[#203752]">
              {roleTitles[role]}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage('front')}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Exit to Front Page
            </button>
            <button
              onClick={signOut}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Switch Role
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-4 pb-12 pt-7 sm:px-7 lg:px-10">
          {page === 'overview' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-r from-[#173f67] to-[#1e588f] p-6 text-white sm:p-8">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  {roleTitles[role]}
                </p>
                <h2 className="mt-1 font-[var(--app-font-serif)] text-2xl font-bold sm:text-3xl">
                  Welcome back, {greeting}
                </h2>
                <p className="mt-2 max-w-xl text-sm text-blue-100/80">
                  Manage applications, review status, and track allocations in real-time.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <MetricCard
                  label="Total Ventures"
                  value={data.ventures.length}
                  note="In platform pipeline"
                  icon={BriefcaseBusiness}
                />
                <MetricCard
                  label="Approved Ventures"
                  value={approved.length}
                  note="Ready for investment"
                  icon={BadgeCheck}
                  tone="green"
                />
                <MetricCard
                  label="Your Applications"
                  value={mine.length}
                  note="Submitted from workspace"
                  icon={FileText}
                  tone="amber"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-bold text-slate-800">Recent Applications</h3>
                <div className="mt-4 space-y-2">
                  {data.ventures.slice(0, 5).map((v) => (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVenture(v)}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-800 text-sm">{v.name}</p>
                          {v.interests.length > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200/60">
                              <Bookmark className="size-2.5 fill-current" />
                              <span>
                                {v.interests.length}{' '}
                                {v.interests.length === 1 ? 'Investor' : 'Investors'} Interested
                              </span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {v.founder} · {v.university} · {v.category}
                        </p>
                        {v.interests.length > 0 && (
                          <p className="text-[11px] text-blue-600 font-medium mt-0.5">
                            Interested:{' '}
                            <span className="font-semibold text-slate-700">
                              {v.interests.join(', ')}
                            </span>
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-blue-700">
                          ₹ {v.requestedAmount} Lakhs
                        </span>
                        <StatusBadge status={v.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {page === 'applications' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800">My Applications</h2>
              <div className="space-y-3">
                {mine.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVenture(v)}
                    className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-800">{v.name}</h3>
                      <StatusBadge status={v.status} />
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{v.tagline}</p>
                    <p className="mt-2 text-xs font-semibold text-blue-700">
                      Funding Requested: ₹ {v.requestedAmount} Lakhs
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {page === 'review' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800">Review Queue</h2>
              <div className="space-y-3">
                {data.ventures.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVenture(v)}
                    className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300 flex items-center justify-between transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-800">{v.name}</h3>
                        <StatusBadge status={v.status} />
                        {v.interests.length > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200/60">
                            <Bookmark className="size-3 fill-current" />
                            <span>
                              {v.interests.length}{' '}
                              {v.interests.length === 1 ? 'Investor' : 'Investors'} Interested
                            </span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {v.founder} · {v.university} · ₹ {v.requestedAmount} Lakhs
                      </p>
                      {v.interests.length > 0 && (
                        <p className="text-xs text-blue-600 font-medium mt-1.5">
                          Interested investors:{' '}
                          <span className="font-semibold text-slate-700">
                            {v.interests.join(', ')}
                          </span>
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
                    >
                      Review
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {page === 'discover' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800">Discover Approved Ventures</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {approved.map((v) => (
                  <FeaturedHighlightCard
                    key={v.id}
                    venture={v}
                    onSelect={() => setSelectedVenture(v)}
                    onInterest={() => toggleInterest(v)}
                    isInterested={v.interests.includes(displayName)}
                  />
                ))}
              </div>
            </div>
          )}

          {page === 'submit' && (
            <div className="max-w-2xl mx-auto rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Submit New Project</h2>
              <ApplicationForm
                name={displayName}
                onSubmit={addApplication}
                onCancel={() => setPage('overview')}
              />
            </div>
          )}
        </main>
      </div>

      {selectedVenture && (
        <Modal
          title={selectedVenture.name}
          subtitle={selectedVenture.tagline}
          onClose={() => setSelectedVenture(null)}
          wide
        >
          <VentureDetailsModal
            venture={selectedVenture}
            role={role}
            displayName={displayName}
            onDecision={(status, feedback, budget) => {
              changeVenture(selectedVenture.id, {
                status,
                feedback,
                ...(status === 'Approved' ? { approvedBudget: budget } : {}),
              });
              inform(`Decision updated for ${selectedVenture.name}.`);
            }}
            onInterest={() => toggleInterest(selectedVenture)}
          />
        </Modal>
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[60] flex max-w-sm items-center gap-2 rounded-xl border border-[#dce6ee] bg-white px-4 py-3 text-xs font-semibold text-[#29435d] shadow-lg animate-rise"
        >
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
          {toast}
        </div>
      )}
    </div>
  );
}
