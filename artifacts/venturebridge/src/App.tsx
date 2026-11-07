import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ArrowRight, ArrowUpRight, BadgeCheck, Bell, Bookmark, BookOpen, BriefcaseBusiness,
  Building2, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, Cog, Compass,
  ExternalLink, Factory, FilePlus2, FileText, Filter, GraduationCap, HandCoins,
  IndianRupee, Instagram, LayoutDashboard, Linkedin, LogOut, Menu, MessageSquareText, PenSquare, Plus, Quote, Search,
  ShieldCheck, ShoppingBag, SlidersHorizontal, Sparkles, Twitter, User, Users, Wallet, X, XCircle, Youtube,
  Coins, Phone, Rocket,
} from 'lucide-react';
import { createVenture, loadDemoData, resetDemoData, saveDemoData } from './storage';
import type { DemoData, Role, Venture, VentureStatus } from './types';
import CreatorAuthPage from './pages/CreatorAuthPage';
import {
  clearCurrentSession,
  getCurrentSession,
  saveCurrentSession,
  type UserRole,
} from './auth';
import InvestorAuthPage from './pages/InvestorAuthPage';

type Page = 'front' | 'overview' | 'applications' | 'submit' | 'review' | 'discover' | 'creator-auth' | 'investor-auth';

const roleTitles: Record<Role, string> = {
  student: 'Creator',
  admin: 'Program administrator',
  investor: 'Investor',
};

const statusStyles: Record<VentureStatus, string> = {
  'Under review': 'bg-amber-50 text-amber-800 ring-amber-200',
  'Revision requested': 'bg-orange-50 text-orange-800 ring-orange-200',
  Approved: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  'Not selected': 'bg-slate-100 text-slate-600 ring-slate-200',
};

const formatPriceBadge = (rangeId: string) => {
  if (rangeId === '50+') return '₹ 50+';
  return `₹ ${rangeId.replace('-', ' - ')}`;
};

const dateLabel = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

function StatusBadge({ status }: { status: VentureStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${statusStyles[status]}`}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

// Brand Logo matching IdeaBridge style
function IdeaBridgeLogo({ onClick, light = false }: { onClick?: () => void; light?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 text-left transition hover:opacity-90"
    >
      <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#14539a] via-[#1a6ec9] to-[#2e88ed] text-white shadow-sm ring-1 ring-blue-500/20">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <circle cx="5" cy="18" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="19" cy="18" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="7" r="2.8" fill="currentColor" stroke="none" />
          <path d="M5 15.5C7.5 10 9.5 8 12 8s4.5 2 7 7.5" />
        </svg>
      </div>
      <div>
        <span className={`text-[20px] font-extrabold tracking-tight ${light ? 'text-white' : 'text-[#0f2d52]'}`}>
          Idea<span className="text-[#3b82f6]">Bridge</span>
        </span>
      </div>
    </button>
  );
}

// Price ranges from the design
interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

const PRICE_RANGES: PriceRange[] = [
  { id: '50+', label: '1Cr +', min: 50, max: Infinity },
  { id: '30-50', label: '50L - 1Cr', min: 30, max: 50 },
  { id: '15-30', label: '15L - 30L', min: 15, max: 30 },
  { id: '10-15', label: '10L - 15L', min: 10, max: 15 },
  { id: '5-10', label: '5L - 10L', min: 5, max: 10 },
  { id: '2-5', label: '2L - 5L', min: 2, max: 5 },
];

const CATEGORIES = [
  { id: 'Retail', label: 'Retail', icon: ShoppingBag },
  { id: 'Manufacturing', label: 'Manufacturing', icon: Factory },
  { id: 'Service', label: 'Service', icon: Cog },
] as const;

// Success stories data
interface SuccessStory {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  tag: 'Founders' | 'Investors' | 'Mentors';
}

const INITIAL_STORIES: SuccessStory[] = [
  {
    id: 'story-1',
    name: 'Rohit Verma',
    role: 'Founder, AgriTech',
    quote: 'IdeaBridge helped me connect with the right investor. Today our startup is live!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    tag: 'Founders',
  },
  {
    id: 'story-2',
    name: 'Ananya Sharma',
    role: 'Investor, GrowthFund',
    quote: 'We found an innovative student team with amazing potential through IdeaBridge.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    tag: 'Investors',
  },
  {
    id: 'story-3',
    name: 'Karan Mehta',
    role: 'Founder, EduNext',
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
    quote: 'The verification model makes investing in early campus founders transparent and trustworthy.',
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

// Articles data
interface Article {
  id: string;
  title: string;
  date: string;
  readTime: string;
  imageUrl: string;
  excerpt: string;
  author: string;
}

const INITIAL_ARTICLES: Article[] = [
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
    title: "From Idea to Impact: A Student's Guide",
    date: 'Feb 28, 2026',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=80',
    excerpt: 'A step-by-step roadmap for student innovators navigating university patent rights, team formation, and pilot deployments.',
    author: 'Karan Mehta',
  },
];

function Modal({
  title,
  subtitle,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0d2138]/50 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={`max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl ${wide ? 'max-w-3xl' : 'max-w-xl'
          }`}
      >
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            <h2
              id="dialog-title"
              className="font-[var(--app-font-serif)] text-xl font-bold tracking-[-.03em] text-[#1b304a]"
            >
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close dialog"
          >
            <X className="size-5" />
          </button>
        </header>
        <div className="px-5 py-5 sm:px-7 sm:py-6">{children}</div>
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  note,
  icon: Icon,
  tone = 'blue',
}: {
  label: string;
  value: string | number;
  note: string;
  icon: typeof BriefcaseBusiness;
  tone?: string;
}) {
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
        <span className={`flex size-9 items-center justify-center rounded-xl ${tones[tone]}`}>
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

// Accurate relevance scoring function for search
function getSearchRelevance(v: Venture, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const name = v.name.toLowerCase();
  const cat = v.category.toLowerCase();
  const founder = v.founder.toLowerCase();
  const wordsInName = name.split(/[\s\-]+/);

  // 1. Exact name match
  if (name === q) return 1000;
  // 2. Name starts with query (e.g. "Medi" -> "MediConnect")
  if (name.startsWith(q)) return 500;
  // 3. Any word in name starts with query (e.g. "AI" -> "Smart Farming with AI")
  if (wordsInName.some((w) => w.startsWith(q))) return 300;
  // 4. Name contains query
  if (name.includes(q)) return 200;
  // 5. Category starts with query
  if (cat.startsWith(q)) return 150;
  // 6. Founder word starts with query
  if (founder.split(/[\s\-]+/).some((w) => w.startsWith(q))) return 120;
  // 7. Word in tagline starts with query (strict word-boundary match so "intermediaries" doesn't match "medi")
  const wordsInTagline = v.tagline.toLowerCase().split(/[\s\-.,()]+/);
  if (wordsInTagline.some((w) => w.startsWith(q))) return 100;

  return 0;
}

export default function App() {
  const [data, setData] = useState<DemoData>(() => loadDemoData());
  // User starts unauthenticated on fresh load / refresh so site asks to login again
  const [role, setRole] = useState<Role | null>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [page, setPage] = useState<Page>('front');
  const [mobileNav, setMobileNav] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [raiseFundModal, setRaiseFundModal] = useState(false);
  const [creatorMeta, setCreatorMeta] = useState<{
    email?: string;
    university?: string;
    projectName?: string;
    category?: string;
  }>({});

  // Ensure clean logged-out state on site reload so login is required every visit
  useEffect(() => {
    clearCurrentSession();
  }, []);

  // Success Stories & Articles states
  const [storyTag, setStoryTag] = useState<'All' | 'Founders' | 'Investors' | 'Mentors'>('All');
  const [storyPage, setStoryPage] = useState(0);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [writeBlogModal, setWriteBlogModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Front page states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRange, setSelectedRange] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Retail');
  const [selectedVenture, setSelectedVenture] = useState<Venture | null>(null);
  const [toast, setToast] = useState('');

  const commit = (next: DemoData) => {
    setData(next);
    saveDemoData(next);
  };

  const inform = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3200);
  };

  const enterWorkspace = (nextRole: Role, name: string) => {
    // Check session authorization
    const session = getCurrentSession();
    if (!session || session.user.role !== nextRole) {
      if (nextRole === 'admin') {
        saveCurrentSession({
          user: {
            id: 'user-admin',
            name: name,
            email: 'admin@ideabridge.io',
            password: 'admin123',
            role: 'admin',
            createdAt: '2025-01-01',
          },
          token: 'token-admin',
          signedInAt: new Date().toISOString(),
        });
      } else if (nextRole === 'investor') {
        setPage('investor-auth');
        inform('Please log in with an accredited investor account first.');
        return;
      } else if (nextRole === 'student') {
        setPage('creator-auth');
        inform('Please log in with a creator account first.');
        return;
      }
    }
    setRole(nextRole);
    setDisplayName(name);
    setPage('overview');
    setMenuOpen(false);
    inform(`Welcome to ${roleTitles[nextRole]} workspace, ${name.split(' ')[0]}.`);
  };

  const signOut = () => {
    clearCurrentSession();
    setRole(null);
    setDisplayName('');
    setCreatorMeta({});
    setPage('front');
    setSelectedVenture(null);
    inform('You have signed out successfully.');
  };

  const changeVenture = (id: string, patch: Partial<Venture>) => {
    commit({
      ...data,
      ventures: data.ventures.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    });
    setSelectedVenture((current) => (current?.id === id ? { ...current, ...patch } : current));
  };

  const reset = () => {
    if (window.confirm('Reset all IdeaBridge demo changes and restore sample projects?')) {
      const fresh = resetDemoData();
      setData(fresh);
      setSelectedVenture(null);
      setPage('front');
      inform('Sample projects and data have been restored.');
    }
  };

  const addRaiseFundApplication = (form: HTMLFormElement) => {
    const values = new FormData(form);
    const founderName = String(values.get('founder') || displayName || 'Creator');
    const founderEmail = String(values.get('email') || creatorMeta.email || 'creator@domain.com');
    const universityName = String(values.get('university') || creatorMeta.university || 'Innovator');
    const projectName = String(values.get('name') || 'Untitled Project');

    const item = createVenture({
      founder: founderName,
      university: universityName,
      email: founderEmail,
      name: projectName,
      tagline: String(values.get('tagline') || 'Innovative early-stage project'),
      category: String(values.get('category') || 'Retail'),
      description: String(values.get('description')),
      businessModel: String(values.get('businessModel') || 'Sustainable impact model'),
      useOfFunds: String(values.get('useOfFunds')),
      requestedAmount: Number(values.get('requestedAmount')) || 10,
    });

    commit({ ...data, ventures: [item, ...data.ventures] });
    setRaiseFundModal(false);

    if (!role || role !== 'student') {
      const session = {
        user: {
          id: `user-${Date.now().toString(36)}`,
          name: founderName,
          email: founderEmail,
          password: 'Creator@123',
          role: 'student' as const,
          university: universityName,
          projectName: projectName,
          createdAt: new Date().toISOString().slice(0, 10),
        },
        token: `token-${Date.now()}`,
        signedInAt: new Date().toISOString(),
      };
      saveCurrentSession(session);
      setRole('student');
      setDisplayName(founderName);
      setCreatorMeta({
        email: founderEmail,
        university: universityName,
        projectName: projectName,
      });
      inform(`🎉 Funding application for "${projectName}" submitted successfully! You are now logged in as Creator.`);
    } else {
      inform(`🎉 Funding application for "${projectName}" submitted to campus reviewers & angel investors!`);
    }
  };

  const addApplication = (form: HTMLFormElement) => {
    if (!role || role !== 'student') {
      inform('Authorization required: Please log in as a creator to list a project.');
      setSubmitModal(false);
      setPage('creator-auth');
      return;
    }
    const values = new FormData(form);
    const item = createVenture({
      founder: String(values.get('founder') || displayName),
      university: String(values.get('university') || creatorMeta.university || 'Campus Innovator'),
      email: String(values.get('email') || creatorMeta.email || 'founder@college.edu'),
      name: String(values.get('name')),
      tagline: String(values.get('tagline')),
      category: String(values.get('category')),
      description: String(values.get('description')),
      businessModel: String(values.get('businessModel')),
      useOfFunds: String(values.get('useOfFunds')),
      requestedAmount: Number(values.get('requestedAmount')),
    });
    commit({ ...data, ventures: [item, ...data.ventures] });
    setSubmitModal(false);
    inform('Your project has been listed successfully! It is now visible in the showcase.');
  };

  const addArticle = (form: HTMLFormElement) => {
    const values = new FormData(form);
    const newArt: Article = {
      id: `art-${Date.now()}`,
      title: String(values.get('title')),
      author: String(values.get('author') || 'Student Contributor'),
      readTime: '4 min read',
      date: 'Today',
      excerpt: String(values.get('content')).slice(0, 140) + '...',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&auto=format&fit=crop&q=80',
    };
    setArticles([newArt, ...articles]);
    setWriteBlogModal(false);
    inform('Your article has been published to the IdeaBridge Blog!');
  };

  const toggleInterest = (venture: Venture) => {
    if (!role || role !== 'investor') {
      inform('Only registered investors can signal interest. Please sign in as an investor.');
      setPage('investor-auth');
      return;
    }
    const userIdentifier = displayName || 'Interested Investor';
    const interested = venture.interests.includes(userIdentifier);
    changeVenture(venture.id, {
      interests: interested
        ? venture.interests.filter((name) => name !== userIdentifier)
        : [...venture.interests, userIdentifier],
    });
    inform(interested ? 'Interest withdrawn.' : 'Your investment interest has been signaled to the founder!');
  };

    // Computed search results ranked by relevance
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return data.ventures
      .map((v) => ({ venture: v, score: getSearchRelevance(v, searchQuery) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.venture);
  }, [data.ventures, searchQuery]);

  // Top 3 Featured Highlights
  const topFeatured = useMemo(() => {
    return data.ventures.slice(0, 3);
  }, [data.ventures]);

  // Grouped projects by price range for the range rows
  const rangeGroups = useMemo(() => {
    const map: Record<string, Venture[]> = {};
    PRICE_RANGES.forEach((r) => {
      map[r.id] = data.ventures.filter((v) => {
        const amt = v.requestedAmount >= 1000 ? v.requestedAmount / 1000 : v.requestedAmount;
        const matchesRange = v.priceRange === r.id || (amt >= r.min && (r.max === Infinity ? amt >= r.min : amt <= r.max));
        if (!matchesRange) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            v.name.toLowerCase().includes(q) ||
            v.tagline.toLowerCase().includes(q) ||
            v.category.toLowerCase().includes(q) ||
            v.founder.toLowerCase().includes(q);
          if (!matches) return false;
        }

        return true;
      });
    });
    return map;
  }, [data.ventures, searchQuery]);

  // Filtered stories for Tab Slider
  const filteredStories = useMemo(() => {
    if (storyTag === 'All') return INITIAL_STORIES;
    return INITIAL_STORIES.filter((s) => s.tag === storyTag);
  }, [storyTag]);

  // Paginated/windowed stories for the slider (3 per slide on desktop, responsive)
  const currentStories = useMemo(() => {
    const start = storyPage * 3;
    const items = filteredStories.slice(start, start + 3);
    if (items.length < 3) {
      // Loop or fill if needed
      return filteredStories.slice(0, 3);
    }
    return items;
  }, [filteredStories, storyPage]);

  // Workspace sub-collections
  const mine = useMemo(
    () =>
      data.ventures.filter(
        (v) =>
          v.founder === displayName ||
          (displayName === 'Maya Chen' && v.founder === 'Maya Chen'),
      ),
    [data.ventures, displayName],
  );
  const approved = useMemo(
    () => data.ventures.filter((v) => v.status === 'Approved'),
    [data.ventures],
  );

    // Dedicated Creator Auth (Login / Signup for Project Creators)
  if (page === 'creator-auth') {
    return (
      <CreatorAuthPage
        onSuccess={(data) => {
          setRole('student');
          setDisplayName(data.name);
          setCreatorMeta({
            email: data.email,
            university: data.university,
            projectName: data.projectName,
            category: data.category,
          });
          setPage('front');
          setSubmitModal(true);
          inform(`Welcome, ${data.name}! Your founder account is active. You can now list your project.`);
        }}
        onBack={() => setPage('front')}
        onSwitchToInvestor={() => setPage('investor-auth')}
      />
    );
  }

  // Dedicated Investor Auth (Login / Signup for Investors & Angels)
  if (page === 'investor-auth') {
    return (
      <InvestorAuthPage
        onSuccess={(data) => {
          enterWorkspace('investor', data.firmName || data.name);
        }}
        onBack={() => setPage('front')}
        onSwitchToCreator={() => setPage('creator-auth')}
      />
    );
  }

  // If in workspace mode (role is set and page !== 'front')
  if (role && page !== 'front') {
    return renderWorkspaceView({
      role,
      displayName,
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
    });
  }

  // FRONT OPENING PAGE (NEW CONCEPT)
  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#1c2e45] selection:bg-blue-100 selection:text-blue-900 flex flex-col justify-between">
      <div>
        {/* 1. TOP HEADER & ADAPTIVE SEARCH BAR */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            {/* Top row: Logo on left, Actions on right */}
            <div className="flex h-14 items-center justify-between gap-3 py-2">
              <IdeaBridgeLogo onClick={() => { setSelectedRange(null); setSelectedCategory('Retail'); setSearchQuery(''); }} />

              {/* Central Search Bar (Desktop only) */}
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
                      onClick={() => setPage('overview')}
                      className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-blue-800 transition hover:bg-blue-100"
                      title="Open workspace"
                    >
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="max-w-[70px] sm:max-w-none truncate">{displayName}</span>
                      <span className="hidden sm:inline text-[10px] font-normal text-blue-600">({roleTitles[role]})</span>
                    </button>
                    <button
                      type="button"
                      onClick={signOut}
                      className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPage('investor-auth')}
                    className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-blue-700"
                  >
                    <BriefcaseBusiness className="size-3.5 text-slate-500" />
                    <span>Investor Login</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (role === 'student') {
                      setSubmitModal(true);
                    } else {
                      setPage('creator-auth');
                    }
                  }}
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

            {/* Dedicated Full-Width Search Bar on Mobile (< sm) */}
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

          {/* 2. PRICE RANGE ROW - Horizontal scrollable on mobile */}
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

          {/* 3. CATEGORY TABS (Retail, Manufacturing, Service) */}
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

        {/* DRAWER MENU / ROLE SELECTION */}
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
                    onClick={() => enterWorkspace('student', 'Maya Chen')}
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
                    onClick={() => enterWorkspace('investor', 'Northstar Ventures')}
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
                    onClick={() => enterWorkspace('admin', 'Morgan Lee')}
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
                      if (role === 'student') {
                        setSubmitModal(true);
                      } else {
                        setPage('creator-auth');
                      }
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
                    onClick={reset}
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

        {/* MAIN CONTAINER */}
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-12">
          {searchQuery.trim() ? (
            /* SEARCH RESULTS VIEW: MATCHED PROJECTS SHOW ON TOP, EVERYTHING ELSE IS GONE */
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
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition self-start sm:self-auto"
                >
                  <X className="size-3.5 text-slate-400" />
                  <span>Clear Search</span>
                </button>
              </div>

              {/* Matched project cards displayed directly on top */}
              {searchResults.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
                  {searchResults.map((venture) => (
                    <FeaturedHighlightCard
                      key={venture.id}
                      venture={venture}
                      onSelect={() => setSelectedVenture(venture)}
                      onInterest={() => toggleInterest(venture)}
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
                    onClick={() => setSearchQuery('')}
                    className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
                  >
                    Clear Search & View All
                  </button>
                </div>
              )}

              {/* Price Range Breakdown: ONLY rows that have matching ventures; empty rows are GONE! */}
              {searchResults.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Price Range Breakdown
                  </h3>
                  {PRICE_RANGES.map((range) => {
                    const ventures = rangeGroups[range.id] || [];
                    if (ventures.length === 0) return null; // Empty rows remain GONE!

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
                          {ventures.map((v) => (
                            <CompactProjectCard
                              key={v.id}
                              venture={v}
                              onSelect={() => setSelectedVenture(v)}
                              onInterest={() => toggleInterest(v)}
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
          ) : (
            /* NORMAL HOME VIEW - HERO BANNER, FEATURED HIGHLIGHTS, PRICE ROWS, STORIES, BLOG */
            <>

          {/* 4. HERO BANNER CARD */}
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
                    onClick={() => {
                      if (role === 'student') {
                        setSubmitModal(true);
                      } else {
                        setPage('creator-auth');
                      }
                    }}
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#1877f2] px-6 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#1264ce] focus:outline-none focus:ring-4 focus:ring-blue-200"
                  >
                    <span>List Your Project</span>
                    <ArrowRight className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (role === 'investor') {
                        enterWorkspace('investor', displayName || 'Northstar Ventures');
                      } else {
                        setPage('investor-auth');
                      }
                    }}
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300/80 bg-white/90 px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white hover:text-blue-700"
                  >
                    <span>Explore Investors</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRaiseFundModal(true)}
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
                        <svg viewBox="0 0 24 24" className="size-5 fill-current">
                          <path d="M12 2.5s-4 4.5-4 10.5c0 2 1 3.5 1 3.5l1.5-1.5L12 18l1.5-3 1.5 1.5s1-1.5 1-3.5C16 7 12 2.5 12 2.5z" />
                          <circle cx="12" cy="9" r="1.5" fill="#fff" />
                        </svg>
                      </div>
                      <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white shadow-md ring-4 ring-white">
                        <User className="size-7" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="font-semibold text-slate-800 text-sm">
                        Collaborative Student Innovation
                      </p>
                      <p className="text-xs text-slate-500 max-w-xs">
                        Join 120+ creator startups raising non-dilutive campus grants and angel investments.
                      </p>
                    </div>

                    <div className="grid w-full grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
                      <div>
                        <p className="text-xs font-bold text-slate-800">100%</p>
                        <p className="text-[10px] text-slate-400">Campus Verified</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">₹ 2.4 Cr+</p>
                        <p className="text-[10px] text-slate-400">Grants Funded</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">45+</p>
                        <p className="text-[10px] text-slate-400">Active Mentors</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. FEATURED PROJECTS SECTION MATCHING EXACT SCREENSHOT */}
          <section className="space-y-6">
            {/* Header Row: Featured Projects & View More -> */}
            <div className="flex items-center justify-between">
              <h2 className="font-[var(--app-font-serif)] text-2xl font-bold tracking-tight text-[#112d4e]">
                Featured Projects
              </h2>
              <button
                type="button"
                onClick={() => {
                  setSelectedRange(null);
                  inform('Showing all featured pipeline ventures.');
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1877f2] hover:underline"
              >
                <span>View More</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>

            {/* Top 3 Featured Highlight Cards */}
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {topFeatured.map((venture) => (
                <FeaturedHighlightCard
                  key={venture.id}
                  venture={venture}
                  onSelect={() => setSelectedVenture(venture)}
                  onInterest={() => toggleInterest(venture)}
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
                    className={`flex flex-col lg:flex-row items-stretch lg:items-center gap-3 rounded-2xl border p-3 transition ${isRangeSelected
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
                          onSelect={() => setSelectedVenture(v)}
                          onInterest={() => toggleInterest(v)}
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

          {/* 6. SUCCESS STORIES SECTION (TAB SLIDER FORM) */}
          <section className="space-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-[var(--app-font-serif)] text-xl sm:text-2xl font-bold tracking-tight text-[#112d4e]">
                    Success Stories
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                    Real experiences from founders and investors who connected on IdeaBridge.
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
                      onClick={() => setStoryPage((prev) => (prev + 1) * 3 < filteredStories.length ? prev + 1 : 0)}
                      className="flex size-7 sm:size-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-2xs"
                      aria-label="Next story slide"
                    >
                      <ChevronRight className="size-3.5 sm:size-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => inform('More verified founder stories coming soon!')}
                    className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#1877f2] hover:underline ml-2"
                  >
                    <span>View More</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Tab Filter Pills (smooth horizontal scroll on mobile) */}
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

            {/* Slider Cards Grid / Responsive Carousel */}
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {currentStories.map((story) => (
                <div
                  key={story.id}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex gap-4 items-start">
                    {/* User Avatar */}
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-2 ring-slate-100">
                      <img
                        src={story.avatar}
                        alt={story.name}
                        className="size-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Quote & Info */}
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-1 text-blue-500">
                        <Quote className="size-4 fill-current rotate-180 opacity-70" />
                      </div>
                      <p className="text-xs leading-relaxed text-slate-700 italic">
                        "{story.quote}"
                      </p>
                      <div className="pt-1">
                        <h4 className="text-xs font-bold text-[#112d4e]">
                          {story.name}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {story.role}
                        </p>
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
                  onClick={() => setWriteBlogModal(true)}
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
                  onClick={() => setSelectedArticle(art)}
                  className="group flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                >
                  {/* Thumbnail */}
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="size-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Text Content */}
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
          )}
</main>
      </div>

      {/* 8. DARK FOOTER MATCHING EXACT REFERENCE IMAGE */}
      <footer className="mt-20 border-t border-slate-800 bg-[#0a1e36] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          {/* Main Footer Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left Brand & Tagline */}
            <div className="space-y-1">
              <IdeaBridgeLogo light />
              <p className="text-xs text-blue-200/70">
                Connecting innovative minds with growth opportunities.
              </p>
            </div>

            {/* Middle Nav Links */}
            <nav className="flex flex-wrap items-center gap-5 sm:gap-7 text-xs font-medium text-slate-300">
              <button
                type="button"
                onClick={() => inform('IdeaBridge connects campus founders with grant programs and angel investors.')}
                className="hover:text-white transition"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className="hover:text-white transition"
              >
                Browse Projects
              </button>
              <button
                type="button"
                onClick={() => {
                  if (role === 'investor') {
                    enterWorkspace('investor', displayName || 'Northstar Ventures');
                  } else {
                    setPage('investor-auth');
                  }
                }}
                className="hover:text-white transition"
              >
                For Investors
              </button>
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: document.body.scrollHeight - 700, behavior: 'smooth' });
                }}
                className="hover:text-white transition"
              >
                Blog
              </button>
              <button
                type="button"
                onClick={() => inform('Contact us at support@ideabridge.io')}
                className="hover:text-white transition"
              >
                Contact
              </button>
            </nav>

            {/* Divider line and Social Icons */}
            <div className="flex items-center gap-4">
              <span className="hidden lg:block h-6 w-px bg-white/20" />
              <div className="flex items-center gap-3 text-slate-400">
                <a
                  href="#linkedin"
                  onClick={(e) => { e.preventDefault(); inform('Follow IdeaBridge on LinkedIn'); }}
                  className="p-1 hover:text-white transition"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="size-4" />
                </a>
                <a
                  href="#twitter"
                  onClick={(e) => { e.preventDefault(); inform('Follow IdeaBridge on X / Twitter'); }}
                  className="p-1 hover:text-white transition"
                  aria-label="Twitter"
                >
                  <Twitter className="size-4" />
                </a>
                <a
                  href="#instagram"
                  onClick={(e) => { e.preventDefault(); inform('Follow IdeaBridge on Instagram'); }}
                  className="p-1 hover:text-white transition"
                  aria-label="Instagram"
                >
                  <Instagram className="size-4" />
                </a>
                <a
                  href="#youtube"
                  onClick={(e) => { e.preventDefault(); inform('Watch IdeaBridge on YouTube'); }}
                  className="p-1 hover:text-white transition"
                  aria-label="YouTube"
                >
                  <Youtube className="size-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright and Legal Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-5 text-[11px] text-slate-400">
            <div>
              <span>© 2026 IdeaBridge. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => inform('Privacy Policy: All student ideas remain proprietary.')}
                className="hover:text-slate-200 transition"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => inform('Terms of Service: Standard collegiate ecosystem terms apply.')}
                className="hover:text-slate-200 transition"
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() => inform('IdeaBridge Support: Reach out via support@ideabridge.io')}
                className="hover:text-slate-200 transition"
              >
                Support
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Project Detail Modal */}
      {selectedVenture && (
        <Modal
          title={selectedVenture.name}
          subtitle={selectedVenture.tagline}
          onClose={() => setSelectedVenture(null)}
          wide
        >
          <VentureDetails
            venture={selectedVenture}
            role={role || 'investor'}
            displayName={displayName || 'Interested Investor'}
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

      {/* 2. Project Submission Modal */}
      {submitModal && (
        <Modal
          title="List Your Project on IdeaBridge"
          subtitle="Share your concept with campus reviewers and active investors."
          onClose={() => setSubmitModal(false)}
          wide
        >
          <ApplicationForm
            name={displayName || 'Creator'}
            defaultEmail={creatorMeta.email}
            defaultUniversity={creatorMeta.university}
            defaultProjectName={creatorMeta.projectName}
            defaultCategory={creatorMeta.category}
            onSubmit={addApplication}
            onCancel={() => setSubmitModal(false)}
          />
        </Modal>
      )}

      {/* 2b. Raise Fund Modal */}
      {raiseFundModal && (
        <Modal
          title="Raise Funds for Your Project / Idea"
          subtitle="Submit full details of your concept, business model, and funding requirements to reach active angels & grant committees."
          onClose={() => setRaiseFundModal(false)}
          wide
        >
          <RaiseFundForm
            name={displayName || 'Creator'}
            defaultEmail={creatorMeta.email}
            defaultUniversity={creatorMeta.university}
            defaultProjectName={creatorMeta.projectName}
            defaultCategory={creatorMeta.category}
            onSubmit={addRaiseFundApplication}
            onCancel={() => setRaiseFundModal(false)}
          />
        </Modal>
      )}

      {/* 3. Write Blog Modal */}
      {writeBlogModal && (
        <Modal
          title="Write a Blog / Article"
          subtitle="Share your startup learnings, founder tips, or market research."
          onClose={() => setWriteBlogModal(false)}
          wide
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addArticle(e.currentTarget);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700">Article Title</label>
              <input
                name="title"
                required
                placeholder="e.g. 5 Lessons from Building a Campus Pilot"
                className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Author Name</label>
              <input
                name="author"
                placeholder={displayName || 'Your Name / Startup'}
                defaultValue={displayName}
                className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Article Content</label>
              <textarea
                name="content"
                required
                rows={5}
                placeholder="Write your article thoughts here..."
                className="mt-1 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setWriteBlogModal(false)}
                className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 rounded-lg bg-blue-600 px-4 text-xs font-bold text-white hover:bg-blue-700"
              >
                Publish Article
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 4. Article Read Modal */}
      {selectedArticle && (
        <Modal
          title={selectedArticle.title}
          subtitle={`${selectedArticle.date} · ${selectedArticle.readTime} · By ${selectedArticle.author}`}
          onClose={() => setSelectedArticle(null)}
          wide
        >
          <div className="space-y-4">
            <div className="h-56 w-full overflow-hidden rounded-xl bg-slate-100">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="size-full object-cover"
              />
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              {selectedArticle.excerpt}
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              Building a high-growth venture while in college offers unprecedented advantages: direct access to
              talented peers, professor mentorship, and institutional laboratories. By focusing on customer
              discovery and proving unit economics early, founders can leverage IdeaBridge to connect with angel
              networks seeking authentic collegiate innovation.
            </p>
          </div>
        </Modal>
      )}

      {/* Toast Notification */}
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

// 1. Featured Highlight Card (Top 3 Cards in Screenshot)
function FeaturedHighlightCard({
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
          className={`p-1 transition ${isInterested ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'
            }`}
          title={isInterested ? 'Bookmarked' : 'Bookmark project'}
        >
          <Bookmark className={`size-3.5 ${isInterested ? 'fill-current' : ''}`} />
        </button>
      </div>
    </article>
  );
}

// 2. Compact Horizontal Project Card (Inside Range Rows)
function CompactProjectCard({
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
        className={`p-1 transition opacity-70 group-hover:opacity-100 ${isInterested ? 'text-blue-600' : 'text-slate-300 hover:text-blue-600'
          }`}
      >
        <Bookmark className={`size-3.5 ${isInterested ? 'fill-current' : ''}`} />
      </button>
    </article>
  );
}

// Existing Workspace Views (Retained for complete operational functionality)
function renderWorkspaceView({
  role,
  displayName,
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
}: {
  role: Role;
  displayName: string;
  page: Page;
  setPage: (p: Page) => void;
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
}) {
  const greeting =
    role === 'student' ? displayName.split(' ')[0] : role === 'admin' ? 'Morgan' : displayName;

  const nav: { key: Page; label: string; icon: typeof LayoutDashboard }[] =
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
        className={`fixed inset-y-0 left-0 z-40 flex w-[256px] flex-col border-r border-[#e7ebf1] bg-white px-4 transition-transform duration-200 md:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'
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
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition ${page === item.key
                  ? 'bg-[#eaf2fa] text-[#1c578a]'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#243c57]'
                }`}
            >
              <item.icon
                className={`size-[17px] ${page === item.key ? 'text-[#286697]' : 'text-slate-400 group-hover:text-slate-600'
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
                <Metric
                  label="Total Ventures"
                  value={data.ventures.length}
                  note="In platform pipeline"
                  icon={BriefcaseBusiness}
                />
                <Metric
                  label="Approved Ventures"
                  value={approved.length}
                  note="Ready for investment"
                  icon={BadgeCheck}
                  tone="green"
                />
                <Metric
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
                              <span>{v.interests.length} {v.interests.length === 1 ? 'Investor' : 'Investors'} Interested</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {v.founder} · {v.university} · {v.category}
                        </p>
                        {v.interests.length > 0 && (
                          <p className="text-[11px] text-blue-600 font-medium mt-0.5">
                            Interested: <span className="font-semibold text-slate-700">{v.interests.join(', ')}</span>
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
                            <span>{v.interests.length} {v.interests.length === 1 ? 'Investor' : 'Investors'} Interested</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {v.founder} · {v.university} · ₹ {v.requestedAmount} Lakhs
                      </p>
                      {v.interests.length > 0 && (
                        <p className="text-xs text-blue-600 font-medium mt-1.5">
                          Interested investors: <span className="font-semibold text-slate-700">{v.interests.join(', ')}</span>
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
          <VentureDetails
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

function Field({
  label,
  name,
  placeholder,
  required = true,
  type = 'text',
  defaultValue,
  hint,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  defaultValue?: string;
  hint?: string;
}) {
  return (
    <label className="block text-xs font-semibold text-slate-600">
      {label}
      {required && <span className="ml-1 text-[#b75f59]">*</span>}
      <input
        name={name}
        type={type}
        required={required}
        min={type === 'number' ? 1 : undefined}
        step={type === 'number' ? 0.5 : undefined}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#76a0c6] focus:ring-3 focus:ring-[#eaf2fa]"
      />
      {hint && <span className="mt-1 block text-[10px] font-normal text-slate-400">{hint}</span>}
    </label>
  );
}

function RaiseFundForm({
  name,
  defaultEmail,
  defaultUniversity,
  defaultProjectName,
  defaultCategory = 'Agritech',
  onSubmit,
  onCancel,
}: {
  name: string;
  defaultEmail?: string;
  defaultUniversity?: string;
  defaultProjectName?: string;
  defaultCategory?: string;
  onSubmit: (form: HTMLFormElement) => void;
  onCancel: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e.currentTarget);
      }}
      className="space-y-5"
    >
      {/* Top Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <Coins className="size-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950">
              Apply for Non-Dilutive Campus Grants & Angel Investment
            </h4>
            <p className="mt-0.5 text-[11px] leading-relaxed text-emerald-800">
              Ideal for creators and innovators who have an idea but lack funds, or need capital to scale an ongoing project. Fill out the application below to connect with active angel syndicates and grant reviewers.
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.13em] text-[#6384a2]">
          1. Creator & Contact Information
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Creator / Founder Name" name="founder" defaultValue={name} placeholder="e.g. Maya Chen" />
          <Field
            label="Contact Email"
            name="email"
            type="email"
            defaultValue={defaultEmail}
            placeholder="e.g. creator@domain.com"
          />
          <Field
            label="Phone / WhatsApp Contact"
            name="contact"
            type="tel"
            placeholder="e.g. +91 98765 43210"
          />
          <Field
            label="University / Institution / Organization"
            name="university"
            defaultValue={defaultUniversity}
            placeholder="e.g. IIT Bombay, Delhi University, or Independent"
            hint="Optional / Not mandatory"
          />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.13em] text-[#6384a2]">
          2. Idea & Project Overview
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Idea / Project Name"
            name="name"
            defaultValue={defaultProjectName}
            placeholder="e.g. EcoPack Biomaterials"
          />
          <Field
            label="One tag-line (Optional)"
            name="tagline"
            required={false}
            placeholder="e.g. 100% biodegradable agricultural packaging to replace single-use plastic (Optional)"
          />
          <label className="block text-xs font-semibold text-slate-600">
            Sector Category<span className="ml-1 text-[#b75f59]">*</span>
            <select
              required
              name="category"
              defaultValue={defaultCategory || "Agritech"}
              className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 outline-none focus:border-[#76a0c6]"
            >
              <option value="Agritech">Agritech</option>
              <option value="Clean Energy">Clean Energy</option>
              <option value="EdTech">EdTech</option>
              <option value="Environment">Environment & CleanTech</option>
              <option value="Healthcare">Healthcare & Bio</option>
              <option value="IoT">IoT & Hardware</option>
              <option value="Retail">Retail & Consumer</option>
              <option value="Service">Software / Service</option>
              <option value="Logistics">Logistics & Supply Chain</option>
            </select>
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Project Stage<span className="ml-1 text-[#b75f59]">*</span>
            <select
              required
              name="stage"
              defaultValue="Idea / Concept"
              className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 outline-none focus:border-[#76a0c6]"
            >
              <option value="Idea / Concept">Idea / Concept (Need initial funds to build)</option>
              <option value="Prototype / MVP">Prototype / MVP (Working demo ready)</option>
              <option value="Pilot Testing">Pilot Testing (User feedback stage)</option>
              <option value="Early Revenue">Early Revenue (Paying customers)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.13em] text-[#6384a2]">
          3. Opportunity, Innovation & Business Model
        </p>
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-600">
            What is your idea or ongoing project?<span className="ml-1 text-[#b75f59]">*</span>
            <textarea
              required
              name="description"
              rows={3}
              minLength={20}
              placeholder="Describe the problem, who experiences it, and how your project or technology solves it."
              className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal leading-5 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#76a0c6] focus:ring-3 focus:ring-[#eaf2fa]"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            How will it generate revenue or sustain operations?<span className="ml-1 text-[#b75f59]">*</span>
            <textarea
              required
              name="businessModel"
              rows={2}
              placeholder="E.g. Direct sales, subscription, B2B licensing, institutional contracts."
              className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal leading-5 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#76a0c6] focus:ring-3 focus:ring-[#eaf2fa]"
            />
          </label>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.13em] text-[#6384a2]">
          4. Funding Request & Use of Funds
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Funding Requested (in Lakhs INR)"
            name="requestedAmount"
            type="number"
            defaultValue="15"
            placeholder="15"
            hint="e.g. 15 for ₹ 15 Lakhs."
          />
          <Field
            label="Pitch Deck / Demo Video Link (Optional)"
            name="deckUrl"
            type="url"
            placeholder="https://drive.google.com/... or YouTube link"
            hint="Optional link to presentation slides or demo."
          />
        </div>
        <div className="mt-3">
          <label className="block text-xs font-semibold text-slate-600">
            Planned Use of Funds & Key Milestones<span className="ml-1 text-[#b75f59]">*</span>
            <textarea
              required
              name="useOfFunds"
              rows={2}
              placeholder="Explain how this capital will be spent (e.g. 40% prototyping, 30% lab testing, 30% field trials) and what milestone it reaches."
              className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal leading-5 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#76a0c6] focus:ring-3 focus:ring-[#eaf2fa]"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
        >
          <Coins className="size-4" />
          <span>Submit Fund-Raising Application</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </form>
  );
}

function ApplicationForm({
  name,
  defaultEmail,
  defaultUniversity,
  defaultProjectName,
  defaultCategory = 'Retail',
  onSubmit,
  onCancel,
}: {
  name: string;
  defaultEmail?: string;
  defaultUniversity?: string;
  defaultProjectName?: string;
  defaultCategory?: string;
  onSubmit: (form: HTMLFormElement) => void;
  onCancel: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e.currentTarget);
      }}
      className="space-y-5"
    >
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.13em] text-[#6384a2]">
          Creator & Project Info
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Founder name" name="founder" defaultValue={name} />
          <Field label="University / College" name="university" defaultValue={defaultUniversity} placeholder="IIT / BITS / DU etc." />
          <Field
            label="Contact email"
            name="email"
            type="email"
            defaultValue={defaultEmail}
            placeholder="founder@college.edu"
          />
          <Field label="Project name" name="name" defaultValue={defaultProjectName} placeholder="Idea / Project name" />
          <Field
            label="One tag-line (Optional)"
            name="tagline"
            required={false}
            placeholder="A clear, memorable sentence (Optional)"
          />
          <label className="block text-xs font-semibold text-slate-600">
            Sector Category<span className="ml-1 text-[#b75f59]">*</span>
            <select
              required
              name="category"
              defaultValue={defaultCategory || "Retail"}
              className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 outline-none focus:border-[#76a0c6]"
            >
              <option value="Retail">Retail</option>
              <option value="Agritech">Agritech</option>
              <option value="Clean Energy">Clean Energy</option>
              <option value="EdTech">EdTech</option>
              <option value="Environment">Environment</option>
              <option value="Healthcare">Healthcare</option>
              <option value="IoT">IoT</option>
              <option value="Logistics">Logistics</option>
              <option value="Service">Service</option>
            </select>
          </label>
        </div>
      </div>
      <div className="border-t border-slate-100 pt-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.13em] text-[#6384a2]">
          The Opportunity & Solution
        </p>
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-600">
            What are you building?<span className="ml-1 text-[#b75f59]">*</span>
            <textarea
              required
              name="description"
              rows={3}
              minLength={20}
              placeholder="Describe the problem, who experiences it, and how your project solves it."
              className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal leading-5 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#76a0c6] focus:ring-3 focus:ring-[#eaf2fa]"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Business model<span className="ml-1 text-[#b75f59]">*</span>
            <textarea
              required
              name="businessModel"
              rows={2}
              placeholder="How will the project generate revenue or sustain operations?"
              className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal leading-5 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#76a0c6] focus:ring-3 focus:ring-[#eaf2fa]"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Planned use of funds<span className="ml-1 text-[#b75f59]">*</span>
            <textarea
              required
              name="useOfFunds"
              rows={2}
              placeholder="What key milestone will this funding help reach?"
              className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal leading-5 text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#76a0c6] focus:ring-3 focus:ring-[#eaf2fa]"
            />
          </label>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Funding requested (in Lakhs)"
          name="requestedAmount"
          type="number"
          placeholder="18"
          hint="e.g. 18 for ₹ 18 Lakhs."
        />
      </div>
      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1877f2] px-5 text-xs font-bold text-white transition hover:bg-[#1264ce]"
        >
          <span>List Project</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </form>
  );
}

function VentureDetails({
  venture,
  role,
  displayName,
  onDecision,
  onInterest,
}: {
  venture: Venture;
  role: Role | null;
  displayName: string;
  onDecision: (status: VentureStatus, feedback: string, budget: number) => void;
  onInterest: () => void;
}) {
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
                  } expressing interest in this venture`
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[.1em] text-slate-400">{label}</p>
      <p className="mt-1 text-xs font-semibold text-[#344a62]">{value}</p>
    </div>
  );
}

function DetailBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <h3 className="mb-1.5 text-xs font-bold text-[#304760]">{label}</h3>
      <p className="text-xs leading-6 text-slate-600">{text}</p>
    </div>
  );
}
