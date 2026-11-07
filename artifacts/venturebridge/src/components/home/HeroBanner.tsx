import { ArrowRight, Coins, GraduationCap, HandCoins, Rocket, Sparkles, Zap } from 'lucide-react';

export interface HeroBannerProps {
  onListProject: () => void;
  onExploreInvestors: () => void;
  onRaiseFund: () => void;
}

export default function HeroBanner({
  onListProject,
  onExploreInvestors,
  onRaiseFund,
}: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-[#edf5ff] via-[#e5f0fc] to-[#e0edfb] p-6 sm:p-10 shadow-[0_4px_20px_rgba(23,103,197,.06)]">
      <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-blue-200/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 size-72 rounded-full bg-sky-200/30 blur-2xl" />

      <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Left Content */}
        <div className="space-y-4">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#156ec9]">
            Connect Ideas With Opportunities
          </span>
          <h1 className="font-[var(--app-font-serif)] text-3xl font-extrabold leading-[1.15] tracking-tight text-[#0f2d52] sm:text-4xl lg:text-[42px]">
            Turn Your Ideas Into Real-World Impact
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            A platform where creators and innovators showcase ideas, and investors discover
            high-potential opportunities.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onListProject}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#1877f2] px-6 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#1264ce] focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              <span>List Your Project</span>
              <ArrowRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={onExploreInvestors}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300/80 bg-white/90 px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white hover:text-blue-700"
            >
              <span>Explore Investors</span>
            </button>
            <button
              type="button"
              onClick={onRaiseFund}
              className="inline-flex h-11 items-center gap-2 rounded-xl border-2 border-emerald-500 bg-white px-5 text-sm font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-50 hover:border-emerald-600 hover:text-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100"
            >
              <Coins className="size-4 text-emerald-600" />
              <span>Raise Fund</span>
            </button>
          </div>
        </div>

        {/* Right Graphic / Doodle Composition */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-md rounded-2xl bg-white/60 p-5 shadow-sm backdrop-blur-sm border border-white/80">
            <div className="absolute -top-3.5 right-4 z-10 flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-1 text-[11px] font-bold text-blue-700 shadow-sm">
              <Sparkles className="size-3 text-amber-500 fill-amber-400" />
              <span>+ Ideas Build Tomorrow</span>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4 py-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 text-white shadow-md ring-4 ring-white">
                  <GraduationCap className="size-7" />
                </div>
                <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
                  <Rocket className="size-5" />
                </div>
                <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md ring-4 ring-white">
                  <HandCoins className="size-6" />
                </div>
              </div>

              <div>
                <h2 className="text-xs font-bold text-slate-800">Collaborative Creator Innovation</h2>
                <p className="text-[11px] text-slate-500">
                  Join 120+ creator startups raising non-dilutive campus grants and angel investments.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full pt-2 border-t border-slate-200/60 text-center">
                <div>
                  <div className="text-xs font-extrabold text-[#0f2d52]">100%</div>
                  <div className="text-[9px] text-slate-500 font-medium">Campus Verified</div>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#1877f2]">₹ 2.4 Cr+</div>
                  <div className="text-[9px] text-slate-500 font-medium">Grants Funded</div>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#15803d]">45+</div>
                  <div className="text-[9px] text-slate-500 font-medium">Active Mentors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
