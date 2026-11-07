import { ArrowRight, ChevronLeft, ChevronRight, Clock3, PenSquare, Quote } from 'lucide-react';

export interface SuccessStory {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  tag: 'Founders' | 'Investors' | 'Mentors';
}

export interface Article {
  id: string;
  title: string;
  date: string;
  readTime: string;
  imageUrl: string;
  excerpt: string;
  author: string;
}

export const INITIAL_STORIES: SuccessStory[] = [
  {
    id: 'story-1',
    name: 'Rohit Verma',
    role: 'Creator, AgriTech',
    quote: 'IdeaBridge helped me connect with the right investor. Today our startup is live!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    tag: 'Founders',
  },
  {
    id: 'story-2',
    name: 'Ananya Sharma',
    role: 'Investor, GrowthFund',
    quote: 'We found an innovative creator team with amazing potential through IdeaBridge.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    tag: 'Investors',
  },
  {
    id: 'story-3',
    name: 'Karan Mehta',
    role: 'Creator, EduNext',
    quote: 'A seamless platform to showcase ideas and get genuine feedback.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    tag: 'Founders',
  },
  {
    id: 'story-4',
    name: 'Priya Raman',
    role: 'Co-Founder, CommonGround',
    quote: 'From a dorm room prototype to closing our first ₹16 Lakhs grant on IdeaBridge.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    tag: 'Founders',
  },
  {
    id: 'story-5',
    name: 'Vikram Singhania',
    role: 'Managing Partner, Northstar',
    quote: 'The verification model makes investing in early campus creators transparent and trustworthy.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    tag: 'Investors',
  },
  {
    id: 'story-6',
    name: 'Dr. Ramesh Verma',
    role: 'Mentor, IIT Incubation Hub',
    quote: 'Bridging campus R&D directly into institutional angel pipelines has never been faster.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    tag: 'Mentors',
  },
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'How to Make Your Startup Investor Ready',
    date: 'Mar 10, 2026',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80',
    excerpt: 'Key metrics, financial forecasts, and founder signals angel networks look for when reviewing campus grant proposals.',
    author: 'IdeaBridge Editorial',
  },
  {
    id: 'art-2',
    title: 'Top 10 Sectors Investors are Watching in 2026',
    date: 'Mar 5, 2026',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&auto=format&fit=crop&q=80',
    excerpt: 'Agritech automation, sodium-ion batteries, and hyper-local retail are drawing massive seed activity this fiscal year.',
    author: 'GrowthFund Insights',
  },
  {
    id: 'art-3',
    title: "From Idea to Impact: A Creator's Guide",
    date: 'Feb 28, 2026',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=80',
    excerpt: 'A step-by-step roadmap for student innovators navigating university patent rights, team formation, and pilot deployments.',
    author: 'Karan Mehta',
  },
];

export interface CommunitySectionProps {
  storyTag: 'All' | 'Founders' | 'Investors' | 'Mentors';
  setStoryTag: (tag: 'All' | 'Founders' | 'Investors' | 'Mentors') => void;
  storyPage: number;
  setStoryPage: (page: number | ((prev: number) => number)) => void;
  articles: Article[];
  onWriteBlog: () => void;
  onSelectArticle: (article: Article) => void;
  inform: (msg: string) => void;
}

export default function CommunitySection({
  storyTag,
  setStoryTag,
  storyPage,
  setStoryPage,
  articles,
  onWriteBlog,
  onSelectArticle,
  inform,
}: CommunitySectionProps) {
  const filteredStories =
    storyTag === 'All' ? INITIAL_STORIES : INITIAL_STORIES.filter((s) => s.tag === storyTag);

  const currentStories = filteredStories.slice(storyPage * 3, storyPage * 3 + 3);

  return (
    <>
      {/* 6. SUCCESS STORIES SECTION (TAB SLIDER FORM) */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-[var(--app-font-serif)] text-xl sm:text-2xl font-bold tracking-tight text-[#112d4e]">
                Success Stories
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                Real experiences from creators and investors who connected on IdeaBridge.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Slider Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setStoryPage((prev) => Math.max(0, prev - 1))}
                  disabled={storyPage === 0}
                  className="flex size-7 sm:size-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition shadow-2xs"
                  aria-label="Previous story slide"
                >
                  <ChevronLeft className="size-3.5 sm:size-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setStoryPage((prev) => ((prev + 1) * 3 < filteredStories.length ? prev + 1 : 0))
                  }
                  className="flex size-7 sm:size-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-2xs"
                  aria-label="Next story slide"
                >
                  <ChevronRight className="size-3.5 sm:size-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => inform('More verified creator stories coming soon!')}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#1877f2] hover:underline ml-2"
              >
                <span>View More</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Tab Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
            {(['All', 'Founders', 'Investors', 'Mentors'] as const).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setStoryTag(tag);
                  setStoryPage(0);
                }}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition ${
                  storyTag === tag
                    ? 'bg-[#1877f2] text-white shadow-xs'
                    : 'border border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Slider Cards Grid */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {currentStories.map((story) => (
            <div
              key={story.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex gap-4 items-start">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-2 ring-slate-100">
                  <img src={story.avatar} alt={story.name} className="size-full object-cover" loading="lazy" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-1 text-blue-500">
                    <Quote className="size-4 fill-current rotate-180 opacity-70" />
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700 italic">"{story.quote}"</p>
                  <div className="pt-1">
                    <h4 className="text-xs font-bold text-[#112d4e]">{story.name}</h4>
                    <p className="text-[11px] text-slate-500">{story.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. ARTICLES & WRITE BLOG SECTION */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-[var(--app-font-serif)] text-2xl font-bold tracking-tight text-[#112d4e]">
              Articles & Write Blog
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Insights, investor checklists, and startup advice from the community.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onWriteBlog}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
            >
              <PenSquare className="size-3.5" />
              <span>Write Blog</span>
            </button>
            <button
              type="button"
              onClick={() => inform('Viewing all community startup articles.')}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#1877f2] hover:underline"
            >
              <span>View More</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {articles.map((art) => (
            <article
              key={art.id}
              onClick={() => onSelectArticle(art)}
              className="group flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="size-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="min-w-0 flex-1 flex flex-col justify-between h-20">
                <h3 className="line-clamp-2 text-xs sm:text-[13px] font-bold leading-snug text-[#112d4e] group-hover:text-blue-600 transition">
                  {art.title}
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock3 className="size-3" />
                    {art.date}
                  </span>
                  <span>·</span>
                  <span>{art.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
