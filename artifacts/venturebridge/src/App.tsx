import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { createVenture, loadDemoData, resetDemoData, saveDemoData } from './storage';
import type { DemoData, Role, Venture } from './types';
import { PRICE_RANGES, ROLE_TITLES } from './constants';
import { getSearchRelevance } from './lib/search';
import { clearCurrentSession, getCurrentSession, saveCurrentSession } from './auth';

// Pages
import CreatorAuthPage from './pages/CreatorAuthPage';
import InvestorAuthPage from './pages/InvestorAuthPage';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Home Components
import HeroBanner from './components/home/HeroBanner';
import DealPipeline from './components/home/DealPipeline';
import SearchResultsView from './components/home/SearchResultsView';
import CommunitySection, { INITIAL_ARTICLES, type Article } from './components/home/CommunitySection';

// Form & Modal Components
import Modal from './components/common/Modal';
import ApplicationForm from './components/forms/ApplicationForm';
import RaiseFundForm from './components/forms/RaiseFundForm';
import VentureDetailsModal from './components/modals/VentureDetailsModal';
import WorkspaceView from './components/workspaces/WorkspaceView';

type Page = 'front' | 'overview' | 'applications' | 'submit' | 'review' | 'discover' | 'creator-auth' | 'investor-auth';

export default function App() {
  const [data, setData] = useState<DemoData>(() => loadDemoData());
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

  // Community stories & blog state
  const [storyTag, setStoryTag] = useState<'All' | 'Founders' | 'Investors' | 'Mentors'>('All');
  const [storyPage, setStoryPage] = useState(0);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [writeBlogModal, setWriteBlogModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Front page filters & selections
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
    inform(`Welcome to ${ROLE_TITLES[nextRole]} workspace, ${name.split(' ')[0]}.`);
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

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return data.ventures
      .map((v) => ({ venture: v, score: getSearchRelevance(v, searchQuery) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.venture);
  }, [data.ventures, searchQuery]);

  // Featured Highlights
  const topFeatured = useMemo(() => {
    return data.ventures.slice(0, 3);
  }, [data.ventures]);

  // Grouped ventures by price range
  const rangeGroups = useMemo(() => {
    const map: Record<string, Venture[]> = {};
    PRICE_RANGES.forEach((r) => {
      map[r.id] = data.ventures.filter((v) => {
        if (selectedCategory && selectedCategory !== 'All' && v.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          return getSearchRelevance(v, searchQuery) > 0;
        }
        const amt = v.requestedAmount;
        if (r.id === '50+') return amt >= 50;
        return amt >= r.min && amt <= r.max;
      });
    });
    return map;
  }, [data.ventures, selectedCategory, searchQuery]);

  const mine = useMemo(() => {
    if (!role || role !== 'student') return [];
    return data.ventures.filter(
      (v) =>
        v.founder.toLowerCase() === displayName.toLowerCase() ||
        (creatorMeta.email && v.email?.toLowerCase() === creatorMeta.email.toLowerCase())
    );
  }, [data.ventures, displayName, role, creatorMeta]);

  const approved = useMemo(
    () => data.ventures.filter((v) => v.status === 'Approved'),
    [data.ventures]
  );

  // Dedicated Creator Auth Page
  if (page === 'creator-auth') {
    return (
      <CreatorAuthPage
        onSuccess={(authData) => {
          setRole('student');
          setDisplayName(authData.name);
          setCreatorMeta({
            email: authData.email,
            university: authData.university,
            projectName: authData.projectName,
            category: authData.category,
          });
          setPage('front');
          setSubmitModal(true);
          inform(`Welcome, ${authData.name}! Your creator account is active. You can now list your project.`);
        }}
        onBack={() => setPage('front')}
        onSwitchToInvestor={() => setPage('investor-auth')}
      />
    );
  }

  // Dedicated Investor Auth Page
  if (page === 'investor-auth') {
    return (
      <InvestorAuthPage
        onSuccess={(authData) => {
          enterWorkspace('investor', authData.firmName || authData.name);
        }}
        onBack={() => setPage('front')}
        onSwitchToCreator={() => setPage('creator-auth')}
      />
    );
  }

  // Dedicated Role Workspaces
  if (role && page !== 'front') {
    return (
      <WorkspaceView
        role={role}
        displayName={displayName}
        roleTitles={ROLE_TITLES}
        page={page}
        setPage={setPage}
        data={data}
        mine={mine}
        approved={approved}
        mobileNav={mobileNav}
        setMobileNav={setMobileNav}
        signOut={signOut}
        reset={reset}
        selectedVenture={selectedVenture}
        setSelectedVenture={setSelectedVenture}
        changeVenture={changeVenture}
        toggleInterest={toggleInterest}
        addApplication={addApplication}
        inform={inform}
        toast={toast}
      />
    );
  }

  // Front Opening Page
  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#1c2e45] selection:bg-blue-100 selection:text-blue-900 flex flex-col justify-between">
      <div>
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          role={role}
          displayName={displayName}
          roleTitles={ROLE_TITLES}
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
          rangeGroups={rangeGroups}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          onLogoClick={() => {
            setSelectedRange(null);
            setSelectedCategory('Retail');
            setSearchQuery('');
          }}
          onOpenWorkspace={() => setPage('overview')}
          onSignOut={signOut}
          onInvestorLogin={() => setPage('investor-auth')}
          onListProject={() => {
            if (role === 'student') {
              setSubmitModal(true);
            } else {
              setPage('creator-auth');
            }
          }}
          onEnterWorkspace={enterWorkspace}
          onResetData={reset}
        />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-12">
          {searchQuery.trim() ? (
            <SearchResultsView
              searchQuery={searchQuery}
              searchResults={searchResults}
              rangeGroups={rangeGroups}
              displayName={displayName}
              onClearSearch={() => setSearchQuery('')}
              onSelectVenture={setSelectedVenture}
              onToggleInterest={toggleInterest}
            />
          ) : (
            <>
              <HeroBanner
                onListProject={() => {
                  if (role === 'student') {
                    setSubmitModal(true);
                  } else {
                    setPage('creator-auth');
                  }
                }}
                onExploreInvestors={() => {
                  if (role === 'investor') {
                    enterWorkspace('investor', displayName || 'Northstar Ventures');
                  } else {
                    setPage('investor-auth');
                  }
                }}
                onRaiseFund={() => setRaiseFundModal(true)}
              />

              <DealPipeline
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedRange={selectedRange}
                setSelectedRange={setSelectedRange}
                topFeatured={topFeatured}
                rangeGroups={rangeGroups}
                displayName={displayName}
                onSelectVenture={setSelectedVenture}
                onToggleInterest={toggleInterest}
                inform={inform}
              />

              <CommunitySection
                storyTag={storyTag}
                setStoryTag={setStoryTag}
                storyPage={storyPage}
                setStoryPage={setStoryPage}
                articles={articles}
                onWriteBlog={() => setWriteBlogModal(true)}
                onSelectArticle={setSelectedArticle}
                inform={inform}
              />
            </>
          )}
        </main>
      </div>

      <Footer
        role={role}
        displayName={displayName}
        enterWorkspace={enterWorkspace}
        setPage={(newPage) => setPage(newPage)}
        inform={inform}
      />

      {/* Modals */}
      {selectedVenture && (
        <Modal
          title={selectedVenture.name}
          subtitle={selectedVenture.tagline}
          onClose={() => setSelectedVenture(null)}
          wide
        >
          <VentureDetailsModal
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
